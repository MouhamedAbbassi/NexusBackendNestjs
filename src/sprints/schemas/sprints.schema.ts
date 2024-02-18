import {  Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type RessourcesDocument = HydratedDocument<Sprints>;


  export enum SprintStatus {
    Pret = 'Pret',
    encours = 'encours',
    enattente = 'enattente',
    fait = 'fait',

  }
 
  export enum Priority {
    faible = 'faible',
    critique = 'critique',
    eleve = 'eleve',

  }
 

  export enum Type {
    fonctionnelle = 'fonctionnelle',
    qualite = 'qualite',
    bug = 'bug',
    securite = 'securite',
  }


@Schema()
export class Sprints{
  

  @Prop()
  nom: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: [{ name: String, type: { type: String, enum: Object.values(Type) }, priority: { type: String, enum: Object.values(Priority) }, status: { type: String, enum: Object.values(SprintStatus) } }] })
  taches: { name: string; type: string; priority: string; status: string }[];

  @Prop({ type: String, enum: Object.values(SprintStatus) })
  status: SprintStatus;

  @Prop({ type: String, enum: Object.values(Priority) })
  priority: Priority;

  @Prop({ type: String, enum: Object.values(Type) })
  type: Type;

  @Prop()
  esp: number;

  @Prop()
  asp: number;
}



export const SprintsSchema = SchemaFactory.createForClass(Sprints);