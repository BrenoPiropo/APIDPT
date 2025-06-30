import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { VeiculoService } from './veiculo_carro.service';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';

@Controller('veiculos')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Post()
  async create(@Body() createVeiculoDto: CreateVeiculoDto) {
    return this.veiculoService.create(createVeiculoDto);
  }

  @Get()
  async findAll() {
    return this.veiculoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.veiculoService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateVeiculoDto: Partial<CreateVeiculoDto>) {
    return this.veiculoService.update(+id, updateVeiculoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.veiculoService.remove(+id);
    return { message: 'Veículo removido com sucesso' };
  }
}
