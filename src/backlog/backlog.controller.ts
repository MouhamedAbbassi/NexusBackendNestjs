import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BacklogService } from './backlog.service';
import { Backlog } from './schemas/backlog.schema';
import { Tasks } from 'src/tasks/schemas/tasks.schema';
import { Projects } from 'src/projects/schemas/projects.schema';

@Controller('backlog')
export class BacklogController {
  constructor(private readonly backlogService: BacklogService) {}

  ///////////////////ADD BACKLOG TO PROJECT/////////////////
  @Post(':projectId')
  async create(
    @Body() backlog: Backlog,
    @Param('projectId') projectId: string,
  ): Promise<Backlog> {
    try {
      return await this.backlogService.create(backlog, projectId);
    } catch (error) {
      // Handle specific error returned by the service
      if (error.response && error.response.statusCode === 400) {
        throw new InternalServerErrorException(
          'This project already has a backlog',
        );
      } else {
        // Handle other unexpected errors
        throw new InternalServerErrorException('Failed to create backlog');
      }
    }
  }

  ////////////////////////GET ALL BACKLOG////////////////////
  @Get()
  async findAll(): Promise<Backlog[]> {
    try {
      return await this.backlogService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch backlogs');
    }
  }
  ////////////////////////GET ALL PROJECTS////////////////////
  @Get('allProjects')
  async findAllProjects(): Promise<Projects[]> {
    try {
      return await this.backlogService.findAllProjects();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch project');
    }
  }
  ////////////////////////GET ALL PROJECTS////////////////////
  @Get('findAllProjectsWithoutBacklog')
  async findAllProjectsWithoutBL(): Promise<Projects[]> {
    try {
      return await this.backlogService.findAllProjectsWithoutBacklog();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch project');
    }
  }
  ////////////////////////FIND BACKLOG BY ID/////////////////////////
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Backlog> {
    try {
      return await this.backlogService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch backlog');
    }
  }
  ////////////////////////UPDATE BACKLOG/////////////////////////
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() backlog: Backlog,
  ): Promise<Backlog> {
    try {
      return await this.backlogService.update(id, backlog);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update backlog');
    }
  }
  ////////////////////////DELETE BACKLOG/////////////////////////

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Backlog> {
    try {
      return await this.backlogService.Delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete backlog');
    }
  }
  ////////////////////////CREATE TASK TO BACKLOG/////////////////////////
  @Post(':backlogId/tasks')
  async createTaskAndAssignToBacklog(
    @Param('backlogId') backlogId: string,
    @Body() task: Tasks,
  ) {
    try {
      return await this.backlogService.createTaskAndAssignToBacklog(
        backlogId,
        task,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException(
          'Failed to create task and assign it to backlog',
        );
      }
    }
  }

  ///////////////////////FIND PROJECT NAME BY ID/////////////////////////
  @Get(':id/project')
  async findProjectByid(@Param('id') id: string): Promise<Projects> {
    try {
      return await this.backlogService.findProjectById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch project');
    }
  }
  @Get(':id/tasks')
  async findTasksByBacklog(@Param('id') id: string): Promise<Tasks[]> {
    try {
      return await this.backlogService.findTasksByBacklog(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch backlog');
    }
  }
  @Get(':id/completion')
  async BacklogCompletion(@Param('id') id: string): Promise<string> {
    try {
      return await this.backlogService.BacklogCompletion(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to calculate Tasks completion percentage',
      );
    }
  }
}
