import { Injectable, Logger } from '@nestjs/common';
import { ConcertRepository } from './concert.repository';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from './schemas/concert.schema';

@Injectable()
export class ConcertService {
  private readonly logger = new Logger(ConcertService.name);

  constructor(private readonly concertRepository: ConcertRepository) {}
  find() {
    return this.concertRepository.aggregate([
      {
        $lookup: {
          from: 'seattypes',
          localField: '_id',
          foreignField: 'concertId',
          as: 'seatTypes',
        },
      },
    ]);
  }

  createConcert(concert: CreateConcertDto): Promise<Concert> {
    this.logger.debug(concert);
    return this.concertRepository.create(concert);
  }
}
