import { Module } from '@nestjs/common';
import { SprintsController } from './sprints.controller';
import { SprintsService } from './sprints.service';
import { Sprints, SprintsSchema } from './schemas/sprints.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sprints.name, schema: SprintsSchema}])
  ],
  controllers: [SprintsController],
  providers: [SprintsService]
})
export class SprintsModule {}
