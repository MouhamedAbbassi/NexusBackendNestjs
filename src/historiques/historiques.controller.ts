import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { HistoriquesService} from './Historiques.service';
import { Historiques } from 'src/historiques/schemas/historiques.schema';
import { HistoriqueDocument } from './schemas/historiques.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Controller('historiques')
export class HistoriquesController {
   constructor(private readonly historiquesService: HistoriquesService) {}



    @Get()
    FindAll(){
        return this.historiquesService.FindAll();

    }
    @Get("/:id")
    FindOne(@Param() {id}){
        return this.historiquesService.FindOne(id);

    }
 
    @Delete("/:id")
    Delete(@Param() {id}){
        return this.historiquesService.Delete(id);

    }
    @Put("/:id")
    async Update(@Param("id") id: string, @Body() body: Partial<Historiques>) {
        try {
            const updatedHistorique = await this.historiquesService.Update(id, body);
            if (!updatedHistorique) {
                throw new NotFoundException(`Historique avec l'ID ${id} non trouvé.`);
            }
            return updatedHistorique;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

     @Post()
    Add(@Body() body: Historiques) {
       return this.historiquesService.Add(body);
       }


       @Get(':id')
       async findOne(@Param('id') id: string) {
         try {
           const resource = await this.historiquesService.findOneById(id);
           if (!resource) {
             throw new NotFoundException('Resource not found');
           }
           return resource;
         } catch (error) {
           throw new InternalServerErrorException('An error occurred while searching for the resource: ' + error.message);
         }
       }
  

       @Get('byResourceId/:resourceId')
       async findByResourceId(@Param('resourceId') resourceId: string): Promise<Historiques[]> {
           return this.historiquesService.findByResourceId(resourceId);
       }
       @Get('byResourceId/:resourceId')
  async getHistoriqueByResourceId(@Param('resourceId') resourceId: string) {
    try {
      const historique = await this.historiquesService.findByResourceId(resourceId);
      if (!historique) {
        throw new NotFoundException('Historique not found');
      }
      return historique;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find historique by resourceId: ' + error.message);
    }
  }
      }
