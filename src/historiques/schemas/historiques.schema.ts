import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Ressources } from 'src/ressources/schemas/ressources.schema';

export type HistoriqueDocument = HydratedDocument<Historiques>;

@Schema()
export class Historiques {
  @Prop()
  id: string;

  @Prop()
  insertedDate: Date;

  @Prop()
  deleteDate: Date;
  @Prop()
  changedDate: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ressources' })
  ressources: Ressources;
}

export const HistoriquesSchema = SchemaFactory.createForClass(Historiques);