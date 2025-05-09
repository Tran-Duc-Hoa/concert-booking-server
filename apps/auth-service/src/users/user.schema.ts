import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  hashPassword: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: Date.now })
  registrationDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
