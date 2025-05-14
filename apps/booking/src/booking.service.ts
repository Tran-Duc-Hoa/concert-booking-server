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

import { Request } from 'express';
import { BookingRepository } from './booking.repository';
import { CONCERT_SERVICE } from './constants/service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { SeatType } from './interfaces/seat-type.interface';
import { User } from './interfaces/user.interface';
import { RedlockService } from './redlock/redlock.service';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly redlockService: RedlockService,
    @Inject(CONCERT_SERVICE) private concertClient: ClientProxy,
  ) {}

  async createBooking(createBooking: CreateBookingDto, req: Request) {
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

      const seatType: SeatType = await lastValueFrom(
        this.concertClient.send('GET_SEAT_TYPE', {
          seatTypeId: new ObjectId(createBooking.seatTypeId),
        }),
      );

      if (seatType.availableTickets <= 0) {
        throw new BadRequestException('Tickets are sold out');
      }

      const userId = new ObjectId((req.user as User)._id);

      const existingBooking = await this.bookingRepository.findOne({
        concertId: new ObjectId(seatType.concertId),
        userId,
        cancelAt: { $exists: false },
      });
      this.logger.debug(existingBooking);
      if (existingBooking) {
        throw new BadRequestException(
          'You have already booked a ticket for this concert',
        );
      }

      // Update availableTickets
      await lastValueFrom(
        this.concertClient.emit('INCREMENT_SEAT_TYPE', {
          seatTypeId: createBooking.seatTypeId,
          amount: -1,
        }),
      );

      const booking = this.bookingRepository.create(
        {
          seatTypeId: new ObjectId(createBooking.seatTypeId),
          concertId: new ObjectId(createBooking.concertId),
          userId,
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

  find() {
    return this.bookingRepository.find({});
  }

  async cancel(id: string) {
    const resource = `CANCEL_BOOKING_LOCK:${id}`;
    const lockTTL = 10_000;
    let lock: Lock | null = null;
    try {
      lock = await this.redlockService.acquireLock(resource, lockTTL);
      if (!lock) {
        throw new BadRequestException(
          'Could not acquire lock. Please try again.',
        );
      }

      const ticket = await this.bookingRepository.findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          cancelAt: new Date(),
        },
      );

      await lastValueFrom(
        this.concertClient.emit('INCREMENT_SEAT_TYPE', {
          seatTypeId: ticket.seatTypeId,
          amount: 1,
        }),
      );

      return ticket;
    } finally {
      if (lock) await this.redlockService.releaseLock(lock);
    }
  }
}
