import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking extends AbstractDocument {
  @Prop({ required: true })
  seatTypeId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop()
  cancelAt?: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
