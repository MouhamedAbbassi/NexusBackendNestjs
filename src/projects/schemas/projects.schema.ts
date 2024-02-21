import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Backlog } from 'src/backlog/schemas/backlog.schema';
import { Membres } from 'src/membres/schemas/Membres.schema';
import { Ressources } from 'src/ressources/schemas/ressources.schema';
import { Users } from 'src/users/schemas/users.schema';

export type RessourcesDocument = HydratedDocument<Projects>;

@Schema()
export class Projects {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: string;
  @Prop({ required: true })
  endDate: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Ressources.name }])
  ressources: [Ressources];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Membres.name }])
  membres: [Membres];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Backlog' })
  backlog: Backlog;

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  users: [Users];
}

export const ProjectsSchema = SchemaFactory.createForClass(Projects);
