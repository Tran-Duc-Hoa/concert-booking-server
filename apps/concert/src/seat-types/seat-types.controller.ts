import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';

import { RabbitmqService } from '@app/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Types } from 'mongoose';
import { CreateSeatTypeDto } from '../dto/create-seat-type.dto';
import { SeatTypeMessage } from '../interfaces/seat-type-message.interface';
import { SeatTypesService } from './seat-types.service';

@Controller('concerts/seat-types')
export class SeatTypesController {
  private readonly logger = new Logger(SeatTypesController.name);
  constructor(
    private readonly seatTypeService: SeatTypesService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  @Post()
  createConcert(@Body(ValidationPipe) seatType: CreateSeatTypeDto) {
    return this.seatTypeService.createSeatType(seatType);
  }

  @MessagePattern('GET_SEAT_TYPE')
  async handleCreateBooking(
    @Payload() data: SeatTypeMessage,
    @Ctx() context: RmqContext,
  ) {
    this.logger.debug(data);
    const result = await this.seatTypeService.findOne({
      _id: new Types.ObjectId(data.seatTypeId),
    });
    this.logger.debug(result);

    this.rabbitmqService.ack(context);
    return result;
  }

  @EventPattern('INCREMENT_SEAT_TYPE')
  async decrementAvailableSeats(
    @Payload() data: SeatTypeMessage,
    @Ctx() context: RmqContext,
  ) {
    this.logger.debug(data);
    await this.seatTypeService.findOneAndUpdate(
      {
        _id: new Types.ObjectId(data.seatTypeId),
      },
      {
        $inc: { availableTickets: data.amount },
      },
    );

    this.rabbitmqService.ack(context);
  }
}
