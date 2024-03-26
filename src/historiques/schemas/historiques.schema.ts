import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';
import { Ressources } from 'src/ressources/schemas/ressources.schema';

export type HistoriqueDocument = Historiques & Document;

@Schema()
export class Historiques extends Document{
  static create(arg0: { resourceId: any; type: string; dateModification: Date; oldFilePath: null; }) {
      throw new Error('Method not implemented.');
  }
  @Prop()
  id: string;
@Prop()
fileSize: number;
  @Prop()
  insertedDate: Date;

  @Prop()
  deleteDate: Date;
  @Prop()
  modifiedAt: Date;
  @Prop()
  resourceId: string;

  @Prop()
  name: string;
@Prop()
oldFileName: string;
@Prop()
  newFileName: string;
 

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ressources' })
  ressources: Ressources;
}

export const HistoriquesSchema = SchemaFactory.createForClass(Historiques);