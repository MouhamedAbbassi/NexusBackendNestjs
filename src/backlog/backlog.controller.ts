import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BacklogService } from './backlog.service';
import { Backlog } from './schemas/backlog.schema';

@Controller('backlog')
export class BacklogController {
  constructor(private readonly backlogService: BacklogService) {}

    @Post()
    async create(@Body() backlog: Backlog): Promise<Backlog> {
        return this.backlogService.create(backlog);
    }

    @Get()
    async findAll(): Promise<Backlog[]> {
        return this.backlogService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Backlog> {
        return this.backlogService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() backlog: Backlog,
    ): Promise<Backlog> {
        return this.backlogService.update(id, backlog);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Backlog> {
        return this.backlogService.Delete(id);
    }
}
