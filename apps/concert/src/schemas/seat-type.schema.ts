import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SeatTypeDocument = HydratedDocument<SeatType>;

@Schema({ timestamps: true })
export class SeatType extends AbstractDocument {
  @Prop({ required: true })
  concertId: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  totalTickets: number;

  @Prop({ required: true })
  availableTickets: number;

  @Prop({ required: true, enum: ['STANDARD', 'PREMIUM', 'VIP'] })
  type: string;
}

export const SeatTypeSchema = SchemaFactory.createForClass(SeatType);
