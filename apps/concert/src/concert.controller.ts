import { JwtAuthGuard } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Controller('concerts')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  find() {
    return this.concertService.find();
  }

  @Post()
  createConcert(@Body(ValidationPipe) createConcert: CreateConcertDto) {
    return this.concertService.createConcert(createConcert);
  }
}
