/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

import { AuthModule, RabbitmqModule } from '@app/common';
import { BookingController } from './booking.controller';
import { BookingRepository } from './booking.repository';
import { BookingService } from './booking.service';
import { CONCERT_SERVICE } from './constants/service';
import { RedlockModule } from './redlock/redlock.module';
import { BookingSchema, Ticket } from './schemas/ticket.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BOOKING_QUEUE: Joi.string().required(),
        REDIS_HOST_1: Joi.string().required(),
        REDIS_PORT_1: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_BOOKING_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Ticket.name, schema: BookingSchema }]),
    RabbitmqModule.register({
      name: CONCERT_SERVICE,
    }),
    RedlockModule.register(),
    AuthModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
})
export class BookingModule {}
