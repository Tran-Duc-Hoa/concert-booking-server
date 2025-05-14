import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from '@app/common';
import { Request } from 'express';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingController {
  private readonly logger = new Logger(BookingController.name);
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createBooking(
    @Body(ValidationPipe) body: CreateBookingDto,
    @Req() req: Request,
  ) {
    this.logger.debug(req.user);
    return this.bookingService.createBooking(body, req);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  find() {
    return this.bookingService.find();
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@Req() req: Request) {
    const { id } = req.params;
    this.logger.debug(`Cancel booking with id: ${id}`);
    return this.bookingService.cancel(id);
  }
}
