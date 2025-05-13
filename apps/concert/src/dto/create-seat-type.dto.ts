import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from '@nestjs/class-validator';

enum SeatType {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP',
}

export class CreateSeatTypeDto {
  @IsString()
  @IsNotEmpty()
  concertId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(50_000_000)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(20)
  @Max(10_000)
  totalTickets: number;

  @IsString()
  @IsEnum(SeatType, {
    message: 'seatType must be one of: STANDARD, PREMIUM, VIP',
  })
  type: SeatType;
}
