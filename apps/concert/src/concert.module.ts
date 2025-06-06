import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

import { AuthModule } from '@app/common';
import { ConcertController } from './concert.controller';
import { ConcertRepository } from './concert.repository';
import { ConcertService } from './concert.service';
import { Concert, ConcertSchema } from './schemas/concert.schema';
import { SeatTypesModule } from './seat-types/seat-types.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_CONCERT_URI: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_CONCERT_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Concert.name, schema: ConcertSchema }]),
    SeatTypesModule,
    AuthModule,
  ],
  controllers: [ConcertController],
  providers: [ConcertService, ConcertRepository],
})
export class ConcertModule {}
