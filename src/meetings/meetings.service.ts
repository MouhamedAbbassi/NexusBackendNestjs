import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { Meetings, MeetingsDocument } from './schemas/meetings.schema';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MeetingsService {
  private readonly logger = new Logger(MeetingsService.name);

  constructor(
    @InjectModel(Meetings.name) private meetingsModel: Model<MeetingsDocument>,
  ) {}

  async createMeeting(meetingData: Meetings): Promise<Meetings> {
    const createdMeeting = new this.meetingsModel(meetingData);
    this.logger.log('Created Meeting:', createdMeeting);
    return createdMeeting.save();
  }

  async getAllMeetings(): Promise<Meetings[]> {
    return this.meetingsModel.find().exec();
  }
  async getMeetingByLinkMeet(linkMeet: string): Promise<Meetings> {
    const meeting = await this.meetingsModel.findOne({ linkMeet }).exec();

    if (!meeting) {
      throw new NotFoundException(
        `Meeting with linkMeet ${linkMeet} not found`,
      );
    }

    return meeting;
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
  async sendEmail(
    recipient: string,
    subject: string,
    body: string,
    linkMeet: string,
  ): Promise<void> {
    try {
      const generatedlink = 'https://localhost:3000/meetings/' + linkMeet;
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'eduappteam@gmail.com',
          pass: 'IslemAlaa-7',
        },
      });
      const emailBody = `
        <p>Hello,</p>
        <p>${body}</p>
        <p>Please click the following link to join the meeting:</p>
        <a href="${generatedlink}">${generatedlink}</a>
        <p>Thank you!</p>
      `;
      // Send email
      await transporter.sendMail({
        from: 'eduappteam@gmail.com',
        to: 'islem.naffeti@esprit.tn',
        subject: subject,
        html: emailBody,
      });

      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async getMeetingsBySprintId(sprintId: string): Promise<Meetings[]> {
    return this.meetingsModel.find({ sprints: sprintId }).exec();
  }
}
