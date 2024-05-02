import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Projects } from 'src/projects/schemas/projects.schema';

export type MembresDocument = HydratedDocument<Membres>;

export enum Role {
    productOwner = 'product Owner',
    productManager = 'product Manager',
    membre = 'membre',

    

  }

@Schema()
export class Membres {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' })
  projects: Projects;

  @Prop({ type: String, enum: Object.values(Role) })
  role: Role;

  


 
}

export const MembresSchema = SchemaFactory.createForClass(Membres);