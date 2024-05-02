import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Projects } from 'src/projects/schemas/projects.schema';
import { Column } from 'typeorm';

export type UsersDocument = HydratedDocument<Users>;

@Schema({
  timestamps: true
})
export class Users {
  @Prop()
  name: string;

  @Prop()
  email ? : string;


  
  @Prop()
  password ?: string; 

  

  @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop()
  phoneNumber: number;

  @Prop()
  otp: string; // Propriété pour stocker l'OTP de l'utilisateur

  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' })
  projects: Projects;
  
  @Prop({ default: false })
  active: boolean; // Ajoutez le champ active

  
  /*@Prop()
  profileImage: string;*/


  @Prop()
  resetToken: string;

  @Prop()
  resetTokenExpiration: Date;
    save: any;

    @Prop()
    gitHubProfileId ? : string;

    @Prop()
    googleProfileId ? : string;
   /*@Prop({ default: false })
    emailVerified: boolean;
*/
@Prop()
profileAvatar ?:string

@Prop()
lastLogin: Date;
  
}

export const UsersSchema = SchemaFactory.createForClass(Users);
