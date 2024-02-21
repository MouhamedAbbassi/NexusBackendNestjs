import { Module } from '@nestjs/common';
import { HistoriquesController } from './historiques.controller';
import { Historiques, HistoriquesSchema } from './schemas/historiques.schema';
import { HistoriquesService } from './historiques.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Historiques.name, schema: HistoriquesSchema },
    ]),
  ],
  controllers: [HistoriquesController],
  providers: [HistoriquesService],
})
export class HistoriquesModule {}
