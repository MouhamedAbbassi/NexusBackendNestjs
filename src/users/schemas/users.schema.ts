import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Projects } from 'src/projects/schemas/projects.schema';

export type UsersDocument = HydratedDocument<Users>;

@Schema({
  timestamps: true
})
export class Users {
 

  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered']})
  email: string;
  
  @Prop({ required: true })
  password: string; 
  
  @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
  role: string;
  @Prop()
  phoneNumber: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' })
  projects: Projects;

  @Prop()
  resetToken: string;

  @Prop()
  resetTokenExpiration: Date;
    save: any;

    @Prop({ default: false })
    emailVerified: boolean;

  
}

export const UsersSchema = SchemaFactory.createForClass(Users);