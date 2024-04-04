import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MeetingsDocument = HydratedDocument<Meetings>;

export enum Type {
  daily = 'daily',
  afterSprint = 'after sprint',
}

@Schema()
export class Meetings {
  @Prop()
  summary: string;
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDateTime: Date;

  @Prop({ required: true })
  endDateTime: Date;

  @Prop({ type: [{ email: String }], required: true })
  attendees: { email: string }[];

  @Prop({ type: String, enum: Object.values(Type) })
  type: Type;

  @Prop({ type: Date })
  dailyDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'sprints' })
  sprints?: string;
  @Prop({ required: true })
  linkMeet: string;
}

export const MeetingsSchema = SchemaFactory.createForClass(Meetings);
