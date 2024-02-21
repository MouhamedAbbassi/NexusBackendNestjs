import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Projects } from 'src/projects/schemas/projects.schema';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop()
  name: string;

  @Prop()
  email: string;
  @Prop()
  password: string;

  @Prop()
  role: string;
  @Prop()
  phoneNumber: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' })
  projects: Projects;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
