import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type TasksDocument = HydratedDocument<Tasks>;

export enum Status {
  todo = 'Todo',
  progressing = 'Progressing',
  done = 'Done',
  Blocked = 'Blocked',
  Testing = 'Testing',
}

export enum Priority {
  lowest = 'Lowest',
  low = 'Low',
  medium = 'Medium',
  high = 'High',
  highest = 'Highest',
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
  deadLine: Date;

  @Prop({
    type: String,
    enum: Object.values(Priority),
    default: Priority.medium,
  })
  priority: Priority;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Backlog' })
  backlog: string;

  @Prop({ type: String, enum: Object.values(Status), default: Status.todo })
  status: Status;
}

export const TasksSchema = SchemaFactory.createForClass(Tasks);
