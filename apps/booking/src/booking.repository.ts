/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { Ticket } from './schemas/ticket.schema';

@Injectable()
export class BookingRepository extends AbstractRepository<Ticket> {
  protected readonly logger = new Logger(BookingRepository.name);

  constructor(
    @InjectModel(Ticket.name) bookingModel: Model<Ticket>,
    @InjectConnection() connection: Connection,
  ) {
    super(bookingModel, connection);
  }
}
