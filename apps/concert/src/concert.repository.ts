/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { Concert } from './schemas/concert.schema';

@Injectable()
export class ConcertsRepository extends AbstractRepository<Concert> {
  protected readonly logger = new Logger(ConcertsRepository.name);

  constructor(
    @InjectModel(Concert.name) concertModel: Model<Concert>,
    @InjectConnection() connection: Connection,
  ) {
    super(concertModel, connection);
  }
}
