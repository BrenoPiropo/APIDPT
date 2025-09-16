import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { VeiculoService } from './veiculo_carro.service';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';

@Controller('veiculos')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Get()
  findAll() {
    return this.veiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.veiculoService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'foto_veiculo', maxCount: 10 },
      { name: 'foto_vidros', maxCount: 10 },
      { name: 'foto_placa', maxCount: 10 },
      { name: 'foto_chassi', maxCount: 10 },
      { name: 'foto_motor', maxCount: 10 },
    ]),
  )
  async create(
    @Body() createVeiculoDto: CreateVeiculoDto,
    @UploadedFiles()
    files: {
      foto_veiculo?: Express.Multer.File[];
      foto_vidros?: Express.Multer.File[];
      foto_placa?: Express.Multer.File[];
      foto_chassi?: Express.Multer.File[];
      foto_motor?: Express.Multer.File[];
    },
  ) {
    // Converte arquivos para arrays de caminhos
    const fotosData = {
      foto_veiculo: files?.foto_veiculo?.map(f => f.path),
      foto_vidros: files?.foto_vidros?.map(f => f.path),
      foto_placa: files?.foto_placa?.map(f => f.path),
      foto_chassi: files?.foto_chassi?.map(f => f.path),
      foto_motor: files?.foto_motor?.map(f => f.path),
    };

    return this.veiculoService.create(createVeiculoDto, fotosData);
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'foto_veiculo', maxCount: 10 },
      { name: 'foto_vidros', maxCount: 10 },
      { name: 'foto_placa', maxCount: 10 },
      { name: 'foto_chassi', maxCount: 10 },
      { name: 'foto_motor', maxCount: 10 },
    ]),
  )
  async update(
    @Param('id') id: number,
    @Body() updateVeiculoDto: Partial<CreateVeiculoDto>,
    @UploadedFiles()
    files: {
      foto_veiculo?: Express.Multer.File[];
      foto_vidros?: Express.Multer.File[];
      foto_placa?: Express.Multer.File[];
      foto_chassi?: Express.Multer.File[];
      foto_motor?: Express.Multer.File[];
    },
  ) {
    const fotosData = {
      foto_veiculo: files?.foto_veiculo?.map(f => f.path),
      foto_vidros: files?.foto_vidros?.map(f => f.path),
      foto_placa: files?.foto_placa?.map(f => f.path),
      foto_chassi: files?.foto_chassi?.map(f => f.path),
      foto_motor: files?.foto_motor?.map(f => f.path),
    };

    return this.veiculoService.update(id, updateVeiculoDto, fotosData);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.veiculoService.remove(id);
  }
}
