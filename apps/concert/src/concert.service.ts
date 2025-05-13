import { Injectable, Logger } from '@nestjs/common';
import { ConcertRepository } from './concert.repository';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from './schemas/concert.schema';

@Injectable()
export class ConcertService {
  private readonly logger = new Logger(ConcertService.name);

  constructor(private readonly concertRepository: ConcertRepository) {}
  getHello(): string {
    return 'Hello World!';
  }

  createConcert(concert: CreateConcertDto): Promise<Concert> {
    this.logger.debug(concert);
    return this.concertRepository.create(concert);
  }
}
