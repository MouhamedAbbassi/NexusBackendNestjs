import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Projects, ProjectsSchema } from './schemas/projects.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Projects.name, schema: ProjectsSchema },
    ]),
  ],

  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
