import {
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

@Controller('backlog')
export class BacklogController {
  constructor(private readonly backlogService: BacklogService) {}

  ////////////////////////ADD BACKLOG/////////////////////////
  @Post()
  async create(@Body() backlog: Backlog): Promise<Backlog> {
    try {
      return await this.backlogService.create(backlog);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create backlog');
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
}
