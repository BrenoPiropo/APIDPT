import { Controller, Post, Body, Put, Param, Get, Delete } from '@nestjs/common';
import { VeiculoService } from './veiculo_carro.service';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';

@Controller('veiculos')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Post()
  async create(
    @Body() createVeiculoDto: CreateVeiculoDto,
    @Body('fotos') fotosData?: {
      foto_veiculo?: string[];
      foto_vidros?: string[];
      foto_placa?: string[];
      foto_chassi?: string[];
      foto_motor?: string[];
    },
  ) {
    return this.veiculoService.create(createVeiculoDto, fotosData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateVeiculoDto: Partial<CreateVeiculoDto>,
    @Body('fotos') fotosData?: {
      foto_veiculo?: string[];
      foto_vidros?: string[];
      foto_placa?: string[];
      foto_chassi?: string[];
      foto_motor?: string[];
    },
  ) {
    return this.veiculoService.update(id, updateVeiculoDto, fotosData);
  }

  @Get()
  async findAll() {
    return this.veiculoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.veiculoService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.veiculoService.remove(id);
  }
}
