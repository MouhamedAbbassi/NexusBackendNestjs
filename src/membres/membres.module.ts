import { Module } from '@nestjs/common';
import { MembresService } from './membres.service';
import { MembresController } from './membres.controller';
import { Membres, MembresSchema } from './schemas/Membres.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Membres.name, schema: MembresSchema}])
  ],
 
 
  providers: [MembresService],
  controllers: [MembresController]
})
export class MembresModule {}