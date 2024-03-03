import { Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { Meetings, MeetingsSchema } from './schemas/meetings.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Meetings.name, schema: MeetingsSchema },
    ]),
  ],

  controllers: [MeetingsController],
  providers: [MeetingsService],
})
export class MeetingsModule {}
