import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AgenteService } from './agente.service';
import { CreateAgenteDto } from './dto/create-agente.dto';
import { UpdateAgenteDto } from './dto/update-agente.dto';

@Controller('agente')
export class AgenteController {
  constructor(private readonly agenteService: AgenteService) {}

  @Post()
  create(@Body() dto: CreateAgenteDto) {
    return this.agenteService.create(dto);
  }
  @Post('login')
  async login(@Body() body: { nome: string; senha: string }) {
    const agente = await this.agenteService.login(body.nome, body.senha);
    if (!agente) {
      return { success: false, message: 'Credenciais inválidas' };
    }

  return {
    success: true,
    data: {
      id_agente: agente.id_agente,
      nome_agente: agente.nome_agente,
    },
  };
}

  @Get()
  findAll() {
    return this.agenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agenteService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAgenteDto) {
    return this.agenteService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agenteService.remove(+id);
  }
}
