import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Tasks, TasksSchema } from './schemas/tasks.schema';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({

  imports: [
    MongooseModule.forFeature([{ name: Tasks.name, schema: TasksSchema}])
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
