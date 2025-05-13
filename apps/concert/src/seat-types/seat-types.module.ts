import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RabbitmqModule } from '@app/common';
import { CONCERT_SERVICE } from '../constants/services';
import { SeatType, SeatTypeSchema } from '../schemas/seat-type.schema';
import { SeatTypesController } from './seat-types.controller';
import { SeatTypesRepository } from './seat-types.repository';
import { SeatTypesService } from './seat-types.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SeatType.name, schema: SeatTypeSchema },
    ]),
    RabbitmqModule.register({ name: CONCERT_SERVICE }),
  ],
  controllers: [SeatTypesController],
  providers: [SeatTypesService, SeatTypesRepository],
})
export class SeatTypesModule {}
