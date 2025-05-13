import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingServiceService: BookingService) {}

  @Post()
  createBooking(@Body(ValidationPipe) body: CreateBookingDto) {
    return this.bookingServiceService.createBooking(body);
  }
}
