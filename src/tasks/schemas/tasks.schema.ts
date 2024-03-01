import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type TasksDocument = HydratedDocument<Tasks>;

export enum Status {
  todo = 'Todo',
  progressing = 'progressing',
  done = 'done',
}
@Schema()
export class Tasks {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  taskId: string;

  @Prop({ required: true })
  userStory: string;

  @Prop({ required: true })
  periority: number;

  @Prop({ required: false })
  estimationDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Backlog' })
  backlog: string;

  @Prop({ type: String, enum: Object.values(Status) })
  status: Status;
}

export const TasksSchema = SchemaFactory.createForClass(Tasks);
