import { Controller } from '@nestjs/common';
import { MembresService } from './membres.service';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Membres } from './schemas/Membres.schema';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Query } from '@nestjs/common';

@Controller('membres')
export class MembresController {
  constructor(private readonly service: MembresService) {}
  @Post()
  Add(@Body() body: Membres) {
    return this.service.Add(body);
  }

  @Get()
  FindAll() {
    return this.service.FindAll();
  }

  @Get('/:id')
  FindOne(@Param('_id') _id: string) {
    return this.service.FindOne(_id);
  }

  @Put('/:id')
  Update(@Param('id') id: string, @Body() body: Membres) {
    return this.service.Update(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.service.Deletemembre(id);
  }

  @Post('/search')
  Search(@Query('key') key) {
    return this.service.Search(key);
  }

  @Get('/sort/name')
  SortByName() {
    return this.service.SortByName();
  }

  @Get('/sort/email')
  SortByEmail() {
    return this.service.SortByEmail();
  }
}
