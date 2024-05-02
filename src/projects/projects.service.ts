import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Projects, ProjectsDocument } from './schemas/projects.schema';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';

import{MembresService} from '../membres/membres.service'


@Injectable()
export class ProjectsService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(Projects.name) private projectsModel: Model<ProjectsDocument>,
    private membresService: MembresService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      auth: {
        user: 'rafik.naouech@esprit.tn',
        pass: '201JMT2826',
      },
    });
  }
  Add(body: Projects) {
    return this.projectsModel.create(body);
  }

  FindAll() {
    return this.projectsModel.find();
  }

  FindOne(id: string) {
    return this.projectsModel.findOne({ _id: id });
  }

  Update(id: string, body: Projects) {
    return this.projectsModel.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }
  /*
    Delete(_id: string) {
    //  return this.projectsModel.remove({ _id: id });
    } */
  Deleteproject(id: string): Promise<any> {
    return this.projectsModel.deleteOne({ _id: id });
  }

  Search(key: string) {
    const keyword = key
      ? {
          $or: [
            { name: { $regex: key, $options: 'i' } },
            { description: { $regex: key, $options: 'i' } },
          ],
        }
      : {};
    return this.projectsModel.find(keyword);
  }

  SortByName() {
    return this.projectsModel.find().sort({ name: 1 });
  }


  async addMembreToProject(projectId: string, membreId: string) {
    try {
      const updatedProject = await this.projectsModel
        .findByIdAndUpdate(
          projectId,
          { $push: { membres: membreId } },
          { new: true }
        )
        .populate('membres');

      
    } catch (error) {
      throw new Error(
        'Une erreur s\'est produite lors de l\'affectation du membre au projet'
      );
    }
  }

 
  

}