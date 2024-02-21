import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Projects } from 'src/projects/schemas/projects.schema';
import { Tasks } from 'src/tasks/schemas/tasks.schema';

export type BacklogDocument = HydratedDocument<Backlog>;

@Schema()
export class Backlog {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' })
  projects: Projects;

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  tasks: [Tasks];
}

export const BacklogSchema = SchemaFactory.createForClass(Backlog);
