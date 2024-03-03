import { Module } from '@nestjs/common';
import { Backlog, BacklogSchema } from './schemas/backlog.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BacklogController } from './backlog.controller';
import { BacklogService } from './backlog.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Backlog.name, schema: BacklogSchema }]),
  ],
  controllers: [BacklogController],
  providers: [BacklogService],
})
export class BacklogModule {}
