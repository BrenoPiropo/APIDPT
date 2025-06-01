import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ProcessoService } from './processo.service';
import { CreateProcessoDto } from './dto/create-processo.dto';
import { UpdateProcessoDto } from './dto/update-processo.dto';
import { ProcessoResponseDto } from './dto/processo-response.dto';

@Controller('processos')
export class ProcessoController {
  constructor(private readonly processoService: ProcessoService) {}

  @Post()
  create(@Body() createProcessoDto: CreateProcessoDto) {
    return this.processoService.create(createProcessoDto);
  }

  @Get()
  findAll() {
    return this.processoService.findAll();
  }

@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProcessoResponseDto> {
  return this.processoService.findOne(id);
}


  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProcessoDto: UpdateProcessoDto) {
    return this.processoService.update(id, updateProcessoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.processoService.remove(id);
  }
}
