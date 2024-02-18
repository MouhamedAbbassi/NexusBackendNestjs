import {  Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type MeetingsDocument = HydratedDocument<Meetings>;


  export enum Type {
    daily = 'daily',
    afterSprint = 'after sprint',
    

  }
 
  


@Schema()
export class Meetings{
  

  @Prop()
  title: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  

  @Prop({ type: String, enum: Object.values(Type) })
  type: Type;

  @Prop()
  status: string;

  

  @Prop({ type: Date })
  dailyDate: Date;

  @Prop()
  linkMeet: string;
}



export const MeetingsSchema = SchemaFactory.createForClass(Meetings);