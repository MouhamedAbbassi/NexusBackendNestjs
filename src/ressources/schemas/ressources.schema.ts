import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
//import { Historiques } from 'src/historiques/schemas/historiques.schema';
import { Projects } from 'src/projects/schemas/projects.schema';

import { Document } from "mongoose";


export type RessourcesDocument = Ressources & Document;


@Schema()
export class Ressources extends Document{
    @Prop()
    id?: string; // Rendre le champ facultatif en ajoutant le '?'

    @Prop({required: true})
    fileName: string;

    @Prop({required: true})
    filePath: string;
    

    @Prop({required: true})
    fileType: string;
    @Prop()
    fileSize: number;
      @Prop()
      insertedDate: Date;
    
      @Prop()
      deleteDate: Date;
      @Prop()
      modifiedAt: Date;
    @Prop()
    expirationDate?: Date; // Rendre le champ facultatif en ajoutant le '?'

    @Prop({ default: Date.now })
    createdAt: Date;
    
    @Prop()
    file?: string;
    @Prop()
    url?: string;
    
    @Prop()
    newFileName: string;
    @Prop()
    link: string;
}
   /* @Prop({required: true})
    Name: string;*/

export const RessourceSchema = SchemaFactory.createForClass(Ressources);