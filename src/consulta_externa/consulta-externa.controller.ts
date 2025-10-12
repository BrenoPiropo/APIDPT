import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ConsultaExternaService } from './consulta-externa.service';
import { CreateConsultaExternaDto } from './dto/create-consulta-externa.dto';

@Controller('consulta-externa')
export class ConsultaExternaController {
  constructor(private readonly consultaService: ConsultaExternaService) {}

  @Get()
  findAll() {
    return this.consultaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.consultaService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateConsultaExternaDto) {
    return this.consultaService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.consultaService.remove(id);
  }
}
