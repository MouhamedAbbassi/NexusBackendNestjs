import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { Sprints } from './schemas/sprints.schema';

@Controller('sprints')
export class SprintsController {

    constructor(private readonly sprintService: SprintsService) {}

    @Post('ajouter')
    async ajouterSprint(
        @Body('nom') nom: string,
        @Body('startDate') startDate: Date,
        @Body('endDate') endDate: Date,
        @Body('taches') taches: { name: string; type: string; priority: string; status: string; esp: number; asp: number;  }[],
        
    ) {
        const nouveauSprint = await this.sprintService.ajouterSprint(nom, startDate, endDate, taches);
        return { sprint: nouveauSprint };
    }

    @Get('all')
  async getAllSprints() {
    const allSprints = await this.sprintService.getAllSprints();
    return { sprints: allSprints };
}

@Delete(':id')
  async deleteSprint(@Param('id') id: string) {
    await this.sprintService.deleteSprint(id);
    return { message: 'Sprint deleted successfully' };
  }

  @Patch('update/:id')
  async updateSprint(@Param('id') id: string, @Body() updateData: Partial<Sprints>) {
    const updatedSprint = await this.sprintService.updateSprint(id, updateData);
    return { sprint: updatedSprint };
  }

  @Get('getsprintbyid/:id')
  async getSprintById(@Param('id') id: string) {
    return this.sprintService.getSprintById(id);
  }
}





