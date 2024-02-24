import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Backlog, BacklogDocument } from './schemas/backlog.schema';

@Injectable()
export class BacklogService {
  constructor(
    @InjectModel(Backlog.name)
    private readonly backlogModel: Model<BacklogDocument>,
  ) {}
  ////////////////////////ADD BACKLOG/////////////////////////
  async create(backlog: Backlog): Promise<Backlog> {
    try {
      const createdBacklog = new this.backlogModel(backlog);
      return await createdBacklog.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create backlog');
    }
  }
  ////////////////////////GET ALL BACKLOG////////////////////
  async findAll(): Promise<Backlog[]> {
    try {
      return await this.backlogModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch backlogs');
    }
  }
  ////////////////////////FIND BACKLOG BY ID/////////////////////////
  async findOne(id: string): Promise<Backlog> {
    try {
      const foundBacklog = await this.backlogModel.findById(id).exec();
      if (!foundBacklog) {
        throw new NotFoundException('Backlog not found');
      }
      return foundBacklog;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch backlog');
    }
  }
  ////////////////////////UPDATE BACKLOG/////////////////////////
  async update(id: string, backlog: Backlog): Promise<Backlog> {
    try {
      return await this.backlogModel
        .findByIdAndUpdate(id, backlog, { new: true })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update backlog');
    }
  }
  ////////////////////////DELETE BACKLOG/////////////////////////
  async Delete(id: string): Promise<Backlog> {
    try {
      return await this.backlogModel.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete backlog');
    }
  }
}
