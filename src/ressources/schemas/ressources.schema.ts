import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Historiques } from 'src/historiques/schemas/historiques.schema';
import { Projects } from 'src/projects/schemas/projects.schema';


export type RessourcesDocument = HydratedDocument<Ressources>;

@Schema()
export class Ressources {
  @Prop()
  id: string;

  @Prop()
  fileName: string;

  @Prop()
  type: string;
  @Prop()
  experationDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Historiques' })
  historiques: Historiques;

  

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' })
  Projects: Projects;
}

export const RessourcesSchema = SchemaFactory.createForClass(Ressources);