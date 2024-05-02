import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SprintsModule } from './sprints/sprints.module';

import { ProjectsService } from './projects/projects.service';
import { TasksController } from './tasks/tasks.controller';
import { BacklogController } from './backlog/backlog.controller';
import { BacklogService } from './backlog/backlog.service';
import { HistoriquesModule } from './historiques/historiques.module';

import { RessourcesModule } from './ressources/ressources.module';
import { RessourcesService } from './ressources/ressources.service';
import { RessourcesController } from './ressources/ressources.controller';
import { MeetingsModule } from './meetings/meetings.module';
import { MembresModule } from './membres/membres.module';
import { ProjectsModule } from './projects/projects.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { MailerModule } from '@nestjs-modules/mailer';

import { Backlog, BacklogSchema } from './backlog/schemas/backlog.schema';
import { Tasks, TasksSchema } from './tasks/schemas/tasks.schema';
import { TasksService } from './tasks/tasks.service';
import { Projects, ProjectsSchema } from './projects/schemas/projects.schema';
import { RessourceSchema, Ressources } from './ressources/schemas/ressources.schema';
import { Historiques, HistoriquesSchema } from './historiques/schemas/historiques.schema';
import { HistoriquesController } from './historiques/historiques.controller';
import { HistoriquesService } from './historiques/Historiques.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WakatimeModule } from './wakatime/wakatime.module';
import { UsersController } from './users/users.controller';
import { WakatimeController } from './wakatime/wakatime.controller';
import { WakatimeService } from './wakatime/wakatime.service';
import { Membres, MembresSchema } from './membres/schemas/Membres.schema';
import { ProjectsController } from './projects/projects.controller';
import { MembresController } from './membres/membres.controller';
import { MembresService } from './membres/membres.service';
//import { FacialRecognitionController } from './facial-recognition/facial-recognition.controller';
//import { FacialRecognitionService } from './facial-recognition/facial-recognition.service';
//import { FacialRecognitionModule } from './facial-recognition/facial-recognition.module';


@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
    ConfigModule.forRoot(),
    JwtModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    SprintsModule,
    MembresModule,
    UsersModule,
    AuthModule,
    WakatimeModule,
    MeetingsModule,
    RessourcesModule,
    HistoriquesModule,
    
    MongooseModule.forFeature([
      { name: Projects.name, schema: ProjectsSchema },
    ]),
    MongooseModule.forFeature([
      { name: Membres.name, schema: MembresSchema },
    ]),
  
    MongooseModule.forFeature([{ name: Backlog.name, schema: BacklogSchema }]),
    MongooseModule.forFeature([{ name: Tasks.name, schema: TasksSchema }]),
    MongooseModule.forFeature([{ name: Ressources.name, schema: RessourceSchema }]),
    MongooseModule.forFeature([{ name: Historiques.name, schema: HistoriquesSchema }]),
    //FacialRecognitionModule,
   
    
    
    

  ],
  controllers: [
    AppController,
    UsersController,
    WakatimeController,
  HistoriquesController,
    RessourcesController,
    BacklogController,
    TasksController,
    ProjectsController,
    MembresController,
    //FacialRecognitionController
  ],
  providers: [
    AppService,
    ProjectsService,
    RessourcesService,
    HistoriquesService,
    BacklogService,
    TasksService,
    WakatimeService,
    ProjectsService,
    MembresService,
    //FacialRecognitionService
  ],








})
export class AppModule {
  
}