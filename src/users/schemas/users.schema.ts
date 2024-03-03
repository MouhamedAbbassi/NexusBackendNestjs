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
<<<<<<< HEAD
  @Prop()
  password: string;

  @Prop()
=======
  
  @Prop({ required: true })
  password: string; 
  
  @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
>>>>>>> 11daeca84d700176ee06da93a1be180673f31991
  role: string;
  @Prop()
  phoneNumber: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' })
  projects: Projects;
<<<<<<< HEAD
=======

  @Prop()
  resetToken: string;

  @Prop()
  resetTokenExpiration: Date;
    save: any;

    @Prop({ default: false })
    emailVerified: boolean;

  
>>>>>>> 11daeca84d700176ee06da93a1be180673f31991
}

export const UsersSchema = SchemaFactory.createForClass(Users);
