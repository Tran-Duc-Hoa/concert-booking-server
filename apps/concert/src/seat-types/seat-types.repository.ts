/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { SeatType } from '../schemas/seat-type.schema';

@Injectable()
export class SeatTypesRepository extends AbstractRepository<SeatType> {
  protected readonly logger = new Logger(SeatTypesRepository.name);

  constructor(
    @InjectModel(SeatType.name) seatTypeModel: Model<SeatType>,
    @InjectConnection() connection: Connection,
  ) {
    super(seatTypeModel, connection);
  }
}
