import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Backlog, BacklogDocument } from './schemas/backlog.schema';
import { Tasks, TasksDocument } from 'src/tasks/schemas/tasks.schema';
import {
  Projects,
  ProjectsDocument,
} from 'src/projects/schemas/projects.schema';

@Injectable()
export class BacklogService {
  constructor(
    @InjectModel(Backlog.name)
    private readonly backlogModel: Model<BacklogDocument>,
    @InjectModel(Tasks.name) private readonly tasksModel: Model<TasksDocument>,
    @InjectModel(Projects.name)
    private readonly projectsModel: Model<ProjectsDocument>,
  ) {}
  ////////////////////////ADD BACKLOG/////////////////////////
  async create(backlog: Backlog, projectId: string): Promise<Backlog> {
    try {
      const existingBacklog = await this.backlogModel
        .findOne({ projects: projectId })
        .exec();
      // If no existing backlog found, proceed with creating a new backlog
      if (!existingBacklog) {
        backlog.projects = projectId;
        const createdBacklog = new this.backlogModel(backlog);
        return await createdBacklog.save();
      } else
        throw new BadRequestException('This project already has a backlog');
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else throw new InternalServerErrorException('Failed to create backlog');
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
  ////////////////////////CREATE TASK TO BACKLOG/////////////////////////
  async createTaskAndAssignToBacklog(
    backlogId: string,
    task: Tasks,
  ): Promise<Tasks> {
    // Find the backlog by ID
    const backlog = await this.backlogModel.findById(backlogId).exec();
    if (!backlog) {
      throw new NotFoundException('Backlog not found');
    }
    // Assign the backlog ID to the task
    task.backlog = backlogId;
    // Create a new task
    const createdTask = new this.tasksModel(task);
    // Save the task
    const savedTask = await createdTask.save();
    // Add the task to the backlog
    backlog.tasks.push(savedTask._id.toString());
    await backlog.save();
    return savedTask;
  }

  ///////////////////////FIND PROJECT NAME BY ID////////// ///////////////
  async findProjectById(id: string): Promise<Projects> {
    try {
      const foundProject = await this.projectsModel.findById(id).exec();
      if (!foundProject) {
        throw new NotFoundException('Project not found');
      }
      return foundProject;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch Project');
    }
  }

  async findTasksByBacklog(id: string): Promise<Tasks[]> {
    try {
      const foundBacklog = await this.backlogModel.findById(id).exec();
      if (!foundBacklog) {
        throw new NotFoundException('Backlog not found');
      }
      // Retrieve task IDs from the found backlog
      const taskIds = foundBacklog.tasks;
      // Fetch tasks using the retrieved task IDs
      const tasks = await this.tasksModel
        .find({ _id: { $in: taskIds } })
        .exec();

      // Return the list of tasks
      return tasks;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch Tasks');
    }
  }
}
