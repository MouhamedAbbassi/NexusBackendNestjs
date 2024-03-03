import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MeetingsService {

  public readonly oauth2Client: any;
  private readonly calendar: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URL,
    );

    this.calendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }

  generateAuthUrl(): string {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  async handleRedirect(code: string): Promise<void> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
  }

  async scheduleEvent(): Promise<void> {
    await this.calendar.events.insert({
      calendarId: 'primary',
      auth: this.oauth2Client,
      conferenceDataVersion: 1,
      requestBody: {
        summary: 'this is a test event',
        description: 'some event that is very important',
        start: {
          dateTime: new Date().toISOString(),
          timeZone: 'Africa/Tunis',
        },
        end: {
          dateTime: new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString(),
          timeZone: 'Africa/Tunis',
        },
        conferenceData: {
          createRequest: {
            requestId: uuid(),
          },
        },
        attendees: [
          {
            email: 'narimen.azzouz@esprit.tn',
          },
        ],
      },
    });
  }
}
  
