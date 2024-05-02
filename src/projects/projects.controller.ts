import { Controller } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Projects } from './schemas/projects.schema';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Delete } from '@nestjs/common';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly service: ProjectsService) {};
    
    @Post()
      Add(@Body() body: Projects) {
        return this.service.Add(body);
      }
    
      @Get()
      FindAll() {
        return this.service.FindAll();
      }
    
      @Get('/:id')
      FindOne(@Param('id') id: string) {
        return this.service.FindOne(id);
      }
    
      @Put('/:id')
      Update(@Param('id') id: string, @Body() body: Projects) {
        return this.service.Update(id, body);
      }
    
      @Delete('/:id')
      Delete(@Param('id') id: string) {
        return this.service.Deleteproject(id);
      }
    
      @Post('/search')
      Search(@Query('key') key) {
        return this.service.Search(key);
      }

      @Get('/sort/name')
      SortByName() {
        return this.service.SortByName();
      }

      @Post(':projectId/members/:memberId')
  async addMemberToProject(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.service.addMembreToProject(projectId, memberId);
  }

}