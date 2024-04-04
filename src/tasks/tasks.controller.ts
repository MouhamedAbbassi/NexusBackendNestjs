import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Status, Tasks } from './schemas/tasks.schema';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  ////////////////////////GET ALL TASKS////////////////////
  @Get()
  async findAll(): Promise<Tasks[]> {
    try {
      return await this.taskService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Tasks fetching fail');
    }
  }
  ////////////////////////FIND TASKS BY ID/////////////////////////
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tasks> {
    try {
      return await this.taskService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch task');
    }
  }
  ////////////////////////UPDATE TASKS/////////////////////////
  @Put(':id')
  async update(@Param('id') id: string, @Body() task: Tasks): Promise<Tasks> {
    try {
      return await this.taskService.update(id, task);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update Task');
    }
  }
  ////////////////////////DELETE TASKS/////////////////////////
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Tasks> {
    try {
      return await this.taskService.Delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete Task');
    }
  }
  @Put(':id/status/:status')
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: Status,
  ): Promise<Tasks> {
    try {
      return await this.taskService.updateStatus(id, status);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update Task');
    }
  }
}
