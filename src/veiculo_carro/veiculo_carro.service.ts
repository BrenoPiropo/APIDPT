import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from './veiculo_carro.entity';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { FotoVeiculoService } from '../foto-veiculo/foto_veiculo.service';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(Veiculo)
    private readonly veiculoRepo: Repository<Veiculo>,
    private readonly fotoService: FotoVeiculoService,
  ) {}

  async create(
    createVeiculoDto: CreateVeiculoDto,
    fotosData?: {
      foto_veiculo?: string[];
      foto_vidros?: string[];
      foto_placa?: string[];
      foto_chassi?: string[];
      foto_motor?: string[];
    },
  ): Promise<Veiculo> {
    const veiculo = this.veiculoRepo.create(createVeiculoDto);
    await this.veiculoRepo.save(veiculo);

    if (fotosData) {
      const fotos = await this.fotoService.saveFotos(veiculo.veiculo_id, fotosData);
      veiculo.fotos = [fotos];
    }

    return veiculo;
  }

  async update(
    id: number,
    updateVeiculoDto: Partial<CreateVeiculoDto>,
    fotosData?: {
      foto_veiculo?: string[];
      foto_vidros?: string[];
      foto_placa?: string[];
      foto_chassi?: string[];
      foto_motor?: string[];
    },
  ): Promise<Veiculo> {
    const veiculo = await this.veiculoRepo.findOne({ where: { veiculo_id: id }, relations: ['fotos'] });
    if (!veiculo) throw new Error('Veículo não encontrado');

    Object.assign(veiculo, updateVeiculoDto);
    await this.veiculoRepo.save(veiculo);

    if (fotosData) {
      const fotos = await this.fotoService.saveFotos(veiculo.veiculo_id, fotosData);
      veiculo.fotos = [fotos];
    }

    return veiculo;
  }

  async findAll(): Promise<Veiculo[]> {
    return this.veiculoRepo.find({ relations: ['fotos'] });
  }

  async findOne(id: number): Promise<Veiculo> {
    return this.veiculoRepo.findOne({ where: { veiculo_id: id }, relations: ['fotos'] });
  }

  async remove(id: number): Promise<void> {
    await this.veiculoRepo.delete(id);
  }
}
