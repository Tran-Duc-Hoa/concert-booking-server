import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConcertDocument = HydratedDocument<Concert>;

@Schema({ timestamps: true })
export class Concert extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: Date, required: true })
  startAt: Date;
}

export const ConcertSchema = SchemaFactory.createForClass(Concert);
