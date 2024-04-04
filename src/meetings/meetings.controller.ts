import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { Meetings } from './schemas/meetings.schema';
import { MeetingsService } from './meetings.service';
import * as nodemailer from 'nodemailer';
@Controller('meet')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  async sendEmail(
    @Body()
    emailData: {
      recipient: { email: string }[];
      subject: string;
      body: string;
      linkMeet: string;
    },
  ): Promise<void> {
    try {
      const { recipient, subject, linkMeet } = emailData;
      const generatedlink = `http://localhost:5173/meeting/${linkMeet}`;
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'narimen.azzouz@gmail.com',
          pass: 'fqbt giry uisj mvhz',
        },
        tls: {
          ciphers: 'SSLv3',
        },
      });
      const emailBody = `
      <p>Hello,</p>
      <p>Please click the following link to join the meeting:</p>
      <a href="${generatedlink}">${generatedlink}</a>
      <p>Thank you!</p>
    `;
      // Send email
      await transporter.sendMail({
        from: 'narimen.azzouz@gmail.com',
        to: recipient.map((r) => r.email).join(','),
        subject: subject,
        html: emailBody,
      });

      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error; // Rethrow the error to ensure it's propagated to the caller
    }
  }

  /*
  @Post('/add')
  async createMeeting(@Body() meetingData: Meetings): Promise<Meetings> {
    return this.meetingsService.createMeeting(meetingData);
  } */

  @Post('/add')
  async createMeeting(@Body() meetingData: Meetings): Promise<Meetings> {
    try {
      const newMeeting = await this.meetingsService.createMeeting(meetingData);
      const emailData = {
        recipient: newMeeting.attendees.map((attendee) => ({
          email: attendee.email,
        })),
        subject: 'New Meeting Added',
        body: `A new meeting titled "${meetingData.summary}" has been added.`,
        linkMeet: newMeeting.linkMeet,
      };
      await this.sendEmail(emailData);
      return newMeeting;
    } catch (error) {
      throw error;
    }
  }
  @Get()
  async getAllMeetings(): Promise<Meetings[]> {
    return this.meetingsService.getAllMeetings();
  }
  @Get('/getbylink/:linkMeet')
  async getbylink(@Param('linkMeet') linkMeet: string): Promise<Meetings> {
    try {
      //  const generatedlink = "https://localhost:8080/meetings/" + linkMeet;
      return this.meetingsService.getMeetingByLinkMeet(linkMeet);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  @Put('update/:id')
  async updateMeeting(
    @Param('id') id: string,
    @Body() meetingData: Meetings,
  ): Promise<Meetings> {
    try {
      return this.meetingsService.updateMeeting(id, meetingData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('/getById/:id')
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

  @Delete('delete/:id')
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

  @Get('bysprint/:sprintId')
  async getMeetingsBySprintId(
    @Param('sprintId') sprintId: string,
  ): Promise<Meetings[]> {
    return this.meetingsService.getMeetingsBySprintId(sprintId);
  }
}
