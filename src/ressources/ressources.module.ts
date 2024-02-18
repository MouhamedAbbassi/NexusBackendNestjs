import { Module } from '@nestjs/common';
import { Ressources, RessourcesSchema } from './schemas/ressources.schema';
import { RessourcesService } from './ressources.service';
import { RessourcesController } from './ressources.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Ressources.name, schema: RessourcesSchema}])
      ],
      providers: [RessourcesService],
      controllers: [RessourcesController]
    })

export class RessourcesModule {}
