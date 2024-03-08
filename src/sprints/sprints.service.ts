import { Injectable } from '@nestjs/common';
import { RessourcesDocument, Sprints } from './schemas/sprints.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SprintsService {

    constructor(@InjectModel(Sprints.name) private sprintModel: Model<RessourcesDocument>){}

    async ajouterSprint(nom: string, startDate: Date, endDate: Date, taches: { name: string; type: string; priority: string; status: string }[], esp: number, asp: number): Promise<Sprints> {
        const createdSprint = new this.sprintModel({
            nom,
            startDate,
            endDate,
            taches,
            esp,
            asp,
        });
    
        return createdSprint.save();
    }

    async getAllSprints(): Promise<Sprints[]> {
        const allSprints = await this.sprintModel.find().exec();
        return allSprints;
      }

      async deleteSprint(id: string): Promise<void> {
        await this.sprintModel.findByIdAndDelete(id).exec();
      }

      async updateSprint(id: string, updateData: Partial<Sprints>): Promise<Sprints> {
        const updatedSprint = await this.sprintModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updatedSprint) {
          // Handle the case where the sprint with the given ID was not found
          throw new Error('Sprint not found');
        }
        return updatedSprint;
      }

      async getSprintById(id: string): Promise<Sprints> {
        return this.sprintModel.findById(id).exec();
      }
}





