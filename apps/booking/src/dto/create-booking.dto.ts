import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  seatTypeId: string;
}
