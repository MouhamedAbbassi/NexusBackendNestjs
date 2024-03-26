import { Module } from '@nestjs/common';
import { RessourcesController } from './ressources.controller';
import { RessourcesService } from './ressources.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoriquesService } from 'src/historiques/Historiques.service';
import { RessourceSchema, Ressources } from './schemas/ressources.schema';
import { Historiques, HistoriquesSchema } from 'src/historiques/schemas/historiques.schema';


@Module({
  imports: [MongooseModule.forFeature([
    { name: Ressources.name, schema: RessourceSchema,},
    { name: Historiques.name, schema: HistoriquesSchema}
  ])
],
  controllers: [RessourcesController],
  providers: [RessourcesService,HistoriquesService]
})
export class RessourcesModule {}
