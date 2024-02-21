import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Backlog, BacklogDocument } from './schemas/backlog.schema';

@Injectable()
export class BacklogService {
  constructor(
    @InjectModel(Backlog.name)
    private readonly backlogModel: Model<BacklogDocument>,
  ) {}

  async create(backlog: Backlog): Promise<Backlog> {
    const createdBacklog = new this.backlogModel(backlog);
    return createdBacklog.save();
  }

  async findAll(): Promise<Backlog[]> {
    return this.backlogModel.find().exec();
  }

  async findOne(id: string): Promise<Backlog> {
    return this.backlogModel.findById(id).exec();
  }

  async update(id: string, backlog: Backlog): Promise<Backlog> {
    return this.backlogModel
      .findByIdAndUpdate(id, backlog, { new: true })
      .exec();
  }

  async Delete(id: string): Promise<Backlog> {
    return this.backlogModel.findByIdAndDelete(id);
  }
}
