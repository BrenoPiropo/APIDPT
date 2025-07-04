import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, Request } from '@nestjs/common';
import { LaudoService } from './laudo.service';
import { Laudo } from './laudo.entity';
import { CreateLaudoDto } from './dto/create-laudo.dto';
import { UpdateLaudoDto } from './dto/update-laudo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('laudo')
export class LaudoController {
  constructor(private readonly laudoService: LaudoService) {}

  @Get()
  findAll(): Promise<Laudo[]> {
    return this.laudoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Laudo> {
    return this.laudoService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateLaudoDto): Promise<Laudo> {
    return this.laudoService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: UpdateLaudoDto): Promise<Laudo> {
    return this.laudoService.update(id, data);
  }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<Laudo> {
    return this.laudoService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pendentes')
  async getLaudosPendentes(@Req() req: any) {
    const agente = req.user as { id_agente: number };
    return this.laudoService.findLaudosPendentesDoAgente(agente.id_agente);
  }
}
