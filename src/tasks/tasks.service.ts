import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Status, Tasks, TasksDocument } from './schemas/tasks.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Tasks.name) private readonly tasksModel: Model<TasksDocument>,
  ) {}
  ////////////////////////GET ALL TASKS////////////////////
  async findAll(): Promise<Tasks[]> {
    try {
      return await this.tasksModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch Tasks');
    }
  }
  ////////////////////////FIND TASKS BY ID/////////////////////////
  async findOne(id: string): Promise<Tasks> {
    try {
      const foundTasks = await this.tasksModel.findById(id).exec();
      if (!foundTasks) {
        throw new NotFoundException('Tasks not found');
      }
      return foundTasks;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch Tasks');
    }
  }
  ////////////////////////UPDATE BACKLOG/////////////////////////
  async update(id: string, task: Tasks): Promise<Tasks> {
    try {
      return await this.tasksModel
        .findByIdAndUpdate(id, task, { new: true })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update task');
    }
  }
  ////////////////////////DELETE BACKLOG/////////////////////////
  async Delete(id: string): Promise<Tasks> {
    try {
      return await this.tasksModel.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete backlog');
    }
  }
  async updateStatus(id: string, status: Status): Promise<Tasks> {
    try {
      // Find the task by ID
      const task = await this.tasksModel.findById(id).exec();

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      // Update the status of the task
      task.status = status;

      // Save the updated task
      return await task.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update task');
    }
  }
  
}
