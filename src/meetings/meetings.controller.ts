import { Body, Controller, Get, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { Meetings } from './schemas/meetings.schema';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';


@Controller()
export class MeetingsController {

  private readonly oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URL,
    );
  }

  private readonly scopes = ['https://www.googleapis.com/auth/calendar'];

  @Get('/google')
  getGoogleLogin(@Res() res) {
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
    });
    res.redirect(url);
  }

  
  @Get('/google/redirect')
  @Redirect()
  async handleGoogleRedirect(@Query('code') code: string, @Req() req: Request) {
    if (!code) {
      return { url: '/erreur' };
    }

    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return { url: '/schedule_event' };
    } catch (error) {
      // Gérer les erreurs lors de la récupération du jeton
      console.error(error);
      return { url: '/erreur' };
    }
  }

  @Get('/schedule_event')
  async scheduleEvent() {
    const calendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
    });

    await calendar.events.insert({
      calendarId: 'primary',
      auth: this.oauth2Client,
      conferenceDataVersion: 1,
      requestBody: {
        summary: 'Ghazii ba3ed 3andeek meet m3ayaa Madame Narimen ',
        description: 'some event that very very important',
        start: {
          dateTime: dayjs(new Date()).add(1, 'day').toISOString(),
          timeZone: 'Africa/Tunis',
        },
        end: {
          dateTime: dayjs(new Date())
            .add(1, 'day')
            .add(1, 'hour')
            .toISOString(),
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
    return { msg: 'Done' };
  }
}

