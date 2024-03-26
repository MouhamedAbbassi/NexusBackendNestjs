import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Historiques,HistoriqueDocument } from 'src/historiques/schemas/historiques.schema';

@Injectable()
export class HistoriquesService {
    private historiques: Historiques[] = []; 
    constructor(@InjectModel(Historiques.name) private ressourceModel: Model<HistoriqueDocument>) {}

    
    Add(body: Historiques) {
        return this.ressourceModel.create(body);
    }
    FindAll() {
        return this.ressourceModel.find();
        
    }
    FindOne(id: string){
        return this.ressourceModel.findOne({_id:id});

    }
    
    async Update(id: string, body: Partial<Historiques>) {
        try {
            const updatedHistorique = await this.ressourceModel.findByIdAndUpdate(id, body, { new: true });
            return updatedHistorique;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de l'historique : ${error.message}`);
        }
    }
    Delete(id:string) {
        return this.ressourceModel.findByIdAndDelete({_id:id});
    }
    Search(key:string) {
       const keyword = key
       return this.ressourceModel.find({fileNmae:keyword});
    }

 
      AddHist(name: string) {

        const newHist = new this.ressourceModel;

        newHist.name = name;
        newHist.createdAt = new Date(Date.now());

        newHist.save();
        return newHist;
    }
    UpHist(updatedDate: Date,createdDate:Date ,name: string) {

        const newHist = new this.ressourceModel;
        newHist.name = name;
        newHist.modifiedAt= createdDate;
        newHist.modifiedAt= updatedDate;
        newHist.save();
        return newHist;
    }
    DlHist(createdDate:Date ,name: string) {

        const newHist = new this.ressourceModel;
        newHist.name = name;
        newHist.modifiedAt= createdDate;
        newHist.deleteDate=  new Date(Date.now()) ;
        newHist.save();
        return newHist;
    }


    async findOneById(id: string): Promise<Historiques | null> {
        try {
          const resource = await this.ressourceModel.findOne({ _id: id });
          return resource;
        } catch (error) {
          throw new Error('Failed to find resource');
        }
      }


    }



    

