import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Types } from 'mongoose';
import { Lock } from 'redlock';
import { lastValueFrom } from 'rxjs';
const { ObjectId } = Types;

import { BookingRepository } from './booking.repository';
import { CONCERT_SERVICE } from './constants/service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RedlockService } from './redlock/redlock.service';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly redlockService: RedlockService,
    @Inject(CONCERT_SERVICE) private concertClient: ClientProxy,
  ) {}

  async createBooking(createBooking: CreateBookingDto) {
    const resource = `BOOKING_LOCK:${createBooking.seatTypeId}`;
    const lockTTL = 10_000;
    let lock: Lock | null = null;
    const session = await this.bookingRepository.startTransaction();

    try {
      lock = await this.redlockService.acquireLock(resource, lockTTL);
      if (!lock) {
        throw new BadRequestException(
          'Could not acquire lock. Please try again.',
        );
      }

      const seatType = await lastValueFrom(
        this.concertClient.send('GET_SEAT_TYPE', {
          seatTypeId: new ObjectId(createBooking.seatTypeId),
        }),
      );

      if (seatType.availableSeats === 0) {
        throw new BadRequestException('Tickets are sold out');
      }

      this.logger.debug(seatType);

      const existingBooking = await this.bookingRepository.findOne({
        seatTypeId: new ObjectId(seatType._id),
      });
      this.logger.debug(existingBooking);
      if (existingBooking) {
        throw new BadRequestException(
          'You have already booked a ticket for this concert',
        );
      }

      // Update availableSeats
      await lastValueFrom(
        this.concertClient.emit('DECREMENT_SEAT_TYPE', {
          seatTypeId: createBooking.seatTypeId,
        }),
      );

      // this.logger.debug(seatType);
      const booking = this.bookingRepository.create(
        {
          seatTypeId: new Types.ObjectId(createBooking.seatTypeId),
          userId: new Types.ObjectId(),
        },
        { session },
      );

      await session.commitTransaction();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      if (lock) await this.redlockService.releaseLock(lock);
    }
  }
}
