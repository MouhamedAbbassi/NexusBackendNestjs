import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type BacklogDocument = HydratedDocument<Backlog>;
@Schema()
export class Backlog {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' })
  projects: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks' }])
  tasks: [string];
}

export const BacklogSchema = SchemaFactory.createForClass(Backlog);
