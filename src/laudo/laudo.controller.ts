import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { LaudoService } from './laudo.service';
import { CreateLaudoDto } from './dto/create-laudo.dto';

@Controller('laudo')
export class LaudoController {
  constructor(private readonly laudoService: LaudoService) {}

  @Get()
  findAll() {
    return this.laudoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.laudoService.findOne(id);
  }

  @Post()
  create(@Body() createLaudoDto: CreateLaudoDto) {
    return this.laudoService.create(createLaudoDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: CreateLaudoDto) {
    return this.laudoService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.laudoService.remove(id);
  }
}
