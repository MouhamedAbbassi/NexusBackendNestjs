import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Projects, ProjectsDocument } from './schemas/projects.schema';
import { Model } from 'mongoose';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Projects.name) private projectsModel: Model<ProjectsDocument>,
  ) {}
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
  
    //Deleteprojects(_id: string) : Promise<any> {
   //   return this.projectsModel.deleteOne({ _id: id });
   // } 
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
}
