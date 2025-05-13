import { Injectable } from '@nestjs/common';
import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { CreateSeatTypeDto } from '../dto/create-seat-type.dto';
import { SeatType } from '../schemas/seat-type.schema';
import { SeatTypesRepository } from './seat-types.repository';

@Injectable()
export class SeatTypesService {
  constructor(private readonly seatTypeRepository: SeatTypesRepository) {}
  getHello(): string {
    return 'Hello World!';
  }

  createSeatType(seatType: CreateSeatTypeDto): Promise<SeatType> {
    return this.seatTypeRepository.create({
      ...seatType,
      concertId: new Types.ObjectId(seatType.concertId),
      availableTickets: seatType.totalTickets,
    });
  }

  findOne(filter: FilterQuery<SeatType>) {
    return this.seatTypeRepository.findOne(filter);
  }

  findOneAndUpdate(
    filterQuery: FilterQuery<SeatType>,
    update: UpdateQuery<SeatType>,
  ) {
    return this.seatTypeRepository.findOneAndUpdate(filterQuery, update);
  }
}
