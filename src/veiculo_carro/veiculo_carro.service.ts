import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from './veiculo_carro.entity';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { FotoVeiculoService } from '../foto-veiculo/foto_veiculo.service';
import { Laudo } from '../laudo/laudo.entity';
import { FotoVeiculo } from '../foto-veiculo/foto_veiculo.entity';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(Veiculo)
    private readonly veiculoRepo: Repository<Veiculo>,

    @InjectRepository(Laudo)
    private readonly laudoRepo: Repository<Laudo>,

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

    // Associar laudos
    if (createVeiculoDto.laudoIds?.length > 0) {
      const laudos = await this.laudoRepo.findBy({
        id_laudo: createVeiculoDto.laudoIds as any,
      });
      veiculo.laudos = laudos;
    }

    await this.veiculoRepo.save(veiculo);

    // Salvar fotos
    if (fotosData) {
      const fotos: FotoVeiculo[] = await this.fotoService.saveFotos(
        veiculo.veiculo_id,
        fotosData,
      );
      veiculo.fotos = fotos;
    }

    // Retornar veiculo com laudos e fotos
    return this.veiculoRepo.findOne({
      where: { veiculo_id: veiculo.veiculo_id },
      relations: ['laudos', 'fotos'],
    });
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
    const veiculo = await this.veiculoRepo.findOne({
      where: { veiculo_id: id },
      relations: ['laudos', 'fotos'],
    });
    if (!veiculo) throw new NotFoundException('Veículo não encontrado');

    Object.assign(veiculo, updateVeiculoDto);

    // Atualizar associação com laudos
    if (updateVeiculoDto.laudoIds?.length > 0) {
      const laudos = await this.laudoRepo.findBy({
        id_laudo: updateVeiculoDto.laudoIds as any,
      });
      veiculo.laudos = laudos;
    }

    await this.veiculoRepo.save(veiculo);

    // Atualizar fotos
    if (fotosData) {
      const fotos: FotoVeiculo[] = await this.fotoService.saveFotos(
        veiculo.veiculo_id,
        fotosData,
      );
      veiculo.fotos = fotos;
    }

    return this.veiculoRepo.findOne({
      where: { veiculo_id: veiculo.veiculo_id },
      relations: ['laudos', 'fotos'],
    });
  }

  async findAll(): Promise<Veiculo[]> {
    return this.veiculoRepo.find({ relations: ['laudos', 'fotos'] });
  }

  async findOne(id: number): Promise<Veiculo> {
    const veiculo = await this.veiculoRepo.findOne({
      where: { veiculo_id: id },
      relations: ['laudos', 'fotos'],
    });
    if (!veiculo) throw new NotFoundException('Veículo não encontrado');
    return veiculo;
  }

  async remove(id: number): Promise<void> {
    await this.veiculoRepo.delete(id);
  }
}
