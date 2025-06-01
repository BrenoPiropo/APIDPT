import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GerenteService } from './gerente.service';
import { Gerente } from './gerente.entity';
import { CreateGerenteDto } from './dto/create-gerente.dto';
import { UpdateGerenteDto } from './dto/update-gerente.dto';

@Controller('gerentes')
export class GerenteController {
  constructor(private readonly gerenteService: GerenteService) {}

  // Criar um novo Gerente
  @Post()
  create(@Body() createGerenteDto: CreateGerenteDto): Promise<Gerente> {
    return this.gerenteService.create(createGerenteDto);
  }

  // Buscar todos os Gerentes
  @Get()
  findAll(): Promise<Gerente[]> {
    return this.gerenteService.findAll();
  }

  // Buscar um Gerente por ID
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Gerente> {
    return this.gerenteService.findOne(id);
  }

  // Atualizar um Gerente
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateGerenteDto: UpdateGerenteDto,
  ): Promise<Gerente> {
    return this.gerenteService.update(id, updateGerenteDto);
  }

  // Deletar um Gerente
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.gerenteService.remove(id);
  }
}
