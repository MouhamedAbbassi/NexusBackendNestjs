import { Module } from '@nestjs/common';
import { HistoriquesController } from './Historiques.controller';
import { HistoriquesService } from './Historiques.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Historiques, HistoriquesSchema } from './schemas/historiques.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Historiques.name, schema: HistoriquesSchema}])],
  controllers: [HistoriquesController],
  providers: [HistoriquesService]
})
export class HistoriquesModule {}