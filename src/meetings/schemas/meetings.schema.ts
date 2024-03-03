import {  Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument } from 'mongoose';

export type MeetingsDocument = HydratedDocument<Meetings>;





@Schema()
export class Meetings{
  

  @Prop()
  meetingName: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop()
  sujet: string;

  @Prop({ type: Number })
  quant: number;

  @Prop({ type: Number })
  duree: number;

  @Prop()
  fuseau_horaire: string;

  @Prop({ type: [String] })
  participants: string[];
 


  
}



export const MeetingsSchema = SchemaFactory.createForClass(Meetings);