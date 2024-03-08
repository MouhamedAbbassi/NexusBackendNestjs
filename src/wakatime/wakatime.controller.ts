import { Controller, Get, Req } from '@nestjs/common';
import { WakatimeService } from './wakatime.service';

@Controller('wakatime')
export class WakatimeController {
  constructor(private readonly wakatimeService: WakatimeService) {}

  @Get('current')
  async getCurrentUser(@Req() request) {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTRiYWI3NGZjMzU5NWEyOTQ2OTg0MyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA5NDkyODQxLCJleHAiOjE3MDk3NTIwNDF9.TToFYBoh6kaIpmDONJzM1I_lxExw8azQ7DOMNN-BM8A';
    return this.wakatimeService.getCurrentUser(token);
  }
}
