import { Module } from '@nestjs/common';
import { WakatimeController } from './wakatime.controller';
import { WakatimeService } from './wakatime.service';

@Module({
  controllers: [WakatimeController],
  providers: [WakatimeService]
})
export class WakatimeModule {}
