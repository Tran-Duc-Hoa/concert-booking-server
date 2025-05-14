import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket extends AbstractDocument {
  @Prop({ required: true })
  seatTypeId: Types.ObjectId;

  @Prop({ required: true })
  concertId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop()
  cancelAt?: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Ticket);
