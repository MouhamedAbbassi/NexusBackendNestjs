import {  Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument } from 'mongoose';

export type MeetingsDocument = HydratedDocument<Meetings>;





@Schema()
export class Meetings{
  

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDateTime: Date;

  @Prop({ required: true })
  endDateTime: Date;

  

  @Prop({ type: [{ email: String }], required: true })
  attendees: { email: string }[];
 


  
}



export const MeetingsSchema = SchemaFactory.createForClass(Meetings);