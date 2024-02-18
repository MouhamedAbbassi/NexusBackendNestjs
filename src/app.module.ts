import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SprintsModule } from './sprints/sprints.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ProjectsService } from './projects/projects.service';
import { TasksModule } from './tasks/tasks.module';
import { TasksController } from './tasks/tasks.controller';
import { BacklogModule } from './backlog/backlog.module';
import { BacklogController } from './backlog/backlog.controller';
import { BacklogService } from './backlog/backlog.service';
import { HistoriquesModule } from './historiques/historiques.module';
import { HistoriquesService } from './historiques/historiques.service';
import { RessourcesModule } from './ressources/ressources.module';
import { RessourcesService } from './ressources/ressources.service';
import { RessourcesController } from './ressources/ressources.controller';
import { MeetingsModule } from './meetings/meetings.module';
import { MembresModule } from './membres/membres.module';
import { ProjectsModule } from './projects/projects.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
 

@Module({
  imports: [
  ConfigModule.forRoot(),
  MongooseModule.forRoot(process.env.MONGO_URI),
  SprintsModule, 
   UsersModule,
   ProjectsModule, 
   MembresModule, 
   MeetingsModule, 
   RessourcesModule, 
   HistoriquesModule, 
   BacklogModule,
    TasksModule
],
  controllers: [AppController, UsersController, RessourcesController, BacklogController, TasksController],
  providers: [AppService, ProjectsService, RessourcesService, HistoriquesService, BacklogService],
})
export class AppModule {}
