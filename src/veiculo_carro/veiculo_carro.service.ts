import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from './veiculo_carro.entity';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { FotoVeiculo } from '../foto-veiculo/foto_veiculo.entity';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(Veiculo)
    private readonly veiculoRepo: Repository<Veiculo>,
    @InjectRepository(FotoVeiculo)
    private readonly fotoRepo: Repository<FotoVeiculo>,
  ) {}

  // Cria veículo com fotos
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
    // 1️⃣ Cria o veículo
    const veiculo = this.veiculoRepo.create(createVeiculoDto);
    await this.veiculoRepo.save(veiculo);

    // 2️⃣ Cria um único registro de fotos
    if (fotosData) {
      const fotos = this.fotoRepo.create({
        veiculo_id: veiculo.veiculo_id,
        foto_veiculo: fotosData.foto_veiculo?.filter(f => !!f).join(',') || null,
        foto_vidros: fotosData.foto_vidros?.filter(f => !!f).join(',') || null,
        foto_placa: fotosData.foto_placa?.filter(f => !!f).join(',') || null,
        foto_chassi: fotosData.foto_chassi?.filter(f => !!f).join(',') || null,
        foto_motor: fotosData.foto_motor?.filter(f => !!f).join(',') || null,
      });
      await this.fotoRepo.save(fotos);
      veiculo.fotos = [fotos];
    }

    return veiculo;
  }

  // Retorna todos os veículos com fotos
  async findAll(): Promise<Veiculo[]> {
    return this.veiculoRepo.find({ relations: ['fotos'] });
  }

  // Retorna veículo específico com fotos
  async findOne(id: number): Promise<Veiculo> {
    return this.veiculoRepo.findOne({ where: { veiculo_id: id }, relations: ['fotos'] });
  }

  // Atualiza veículo e fotos
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
      // Atualiza ou cria registro de fotos
      let fotos = veiculo.fotos?.[0];
      if (!fotos) {
        fotos = this.fotoRepo.create({ veiculo_id: veiculo.veiculo_id });
      }

      fotos.foto_veiculo = fotosData.foto_veiculo?.filter(f => !!f).join(',') || fotos.foto_veiculo;
      fotos.foto_vidros = fotosData.foto_vidros?.filter(f => !!f).join(',') || fotos.foto_vidros;
      fotos.foto_placa = fotosData.foto_placa?.filter(f => !!f).join(',') || fotos.foto_placa;
      fotos.foto_chassi = fotosData.foto_chassi?.filter(f => !!f).join(',') || fotos.foto_chassi;
      fotos.foto_motor = fotosData.foto_motor?.filter(f => !!f).join(',') || fotos.foto_motor;

      await this.fotoRepo.save(fotos);
      veiculo.fotos = [fotos];
    }

    return veiculo;
  }

  // Remove veículo
  async remove(id: number): Promise<void> {
    await this.veiculoRepo.delete(id);
  }
}
