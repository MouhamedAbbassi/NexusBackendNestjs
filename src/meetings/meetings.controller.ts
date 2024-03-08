import { Body, Controller, Get, NotFoundException, Param, Post, Put,Delete, Query, Redirect, Req, Res } from '@nestjs/common';
import { Meetings } from './schemas/meetings.schema';
import { MeetingsService } from './meetings.service';


@Controller("meet")
export class MeetingsController {

  constructor(private readonly meetingsService: MeetingsService) {}

  @Post('/add')
  async createMeeting(@Body() meetingData: Meetings): Promise<Meetings> {
    return this.meetingsService.createMeeting(meetingData);
  }

  @Get()
  async getAllMeetings(): Promise<Meetings[]> {
    return this.meetingsService.getAllMeetings();
  }

  @Put("update/:id")
  async updateMeeting(@Param('id') id: string, @Body() meetingData: Meetings): Promise<Meetings> {
    try {
      return this.meetingsService.updateMeeting(id, meetingData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  

  @Get("/getById/:id")
  async getMeetingById(@Param('id') id: string): Promise<Meetings> {
    try {
      return this.meetingsService.getMeetingById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete("delete/:id")
  async deleteMeeting(@Param('id') id: string): Promise<void> {
    try {
      await this.meetingsService.deleteMeeting(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

 
}