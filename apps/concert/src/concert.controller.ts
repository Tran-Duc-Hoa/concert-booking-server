import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Controller('concerts')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Get()
  getHello(): string {
    return this.concertService.getHello();
  }

  @Post()
  createConcert(@Body(ValidationPipe) createConcert: CreateConcertDto) {
    return this.concertService.createConcert(createConcert);
  }
}
