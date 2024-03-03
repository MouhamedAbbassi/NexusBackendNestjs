import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SprintsModule } from './sprints/sprints.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ProjectsService } from './projects/projects.service';
import { TasksController } from './tasks/tasks.controller';
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
import { Backlog, BacklogSchema } from './backlog/schemas/backlog.schema';
import { Tasks, TasksSchema } from './tasks/schemas/tasks.schema';
import { TasksService } from './tasks/tasks.service';
import { Projects, ProjectsSchema } from './projects/schemas/projects.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    SprintsModule,
    UsersModule,
    MembresModule,
    MeetingsModule,
    RessourcesModule,
    HistoriquesModule,
    MongooseModule.forFeature([
      { name: Projects.name, schema: ProjectsSchema },
    ]),
    MongooseModule.forFeature([{ name: Backlog.name, schema: BacklogSchema }]),
    MongooseModule.forFeature([{ name: Tasks.name, schema: TasksSchema }]),
  ],
  controllers: [
    AppController,
    UsersController,
    RessourcesController,
    BacklogController,
    TasksController,
  ],
  providers: [
    AppService,
    ProjectsService,
    RessourcesService,
    HistoriquesService,
    BacklogService,
    TasksService,
  ],
})
export class AppModule{
  
}
