import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import { Meetings, MeetingsDocument } from './schemas/meetings.schema';

@Injectable()
export class MeetingsService {

  constructor(
    @InjectModel(Meetings.name) private meetingsModel: Model<MeetingsDocument>,
  ) {}

  async createMeeting(meetingData: Meetings): Promise<Meetings> {
    const createdMeeting = new this.meetingsModel(meetingData);
    return createdMeeting.save();
  }

  async getAllMeetings(): Promise<Meetings[]> {
    return this.meetingsModel.find().exec();
  }

  async updateMeeting(id: string, meetingData: Meetings): Promise<Meetings> {
    const updatedMeeting = await this.meetingsModel.findByIdAndUpdate(
      id,
      meetingData,
      { new: true }, // Retourne le document mis à jour
    );

    if (!updatedMeeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }

    return updatedMeeting;
  }

  async deleteMeeting(id: string): Promise<void> {
    const deletedMeeting = await this.meetingsModel.findByIdAndDelete(id);

    if (!deletedMeeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }
  }

  async getMeetingById(id: string): Promise<Meetings> {
    const meeting = await this.meetingsModel.findById(id);

    if (!meeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }

    return meeting;
  }
}
