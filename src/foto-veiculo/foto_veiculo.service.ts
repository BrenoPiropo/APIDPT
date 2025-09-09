import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FotoVeiculo } from './foto_veiculo.entity';

@Injectable()
export class FotoVeiculoService {
  constructor(
    @InjectRepository(FotoVeiculo)
    private readonly fotoRepo: Repository<FotoVeiculo>,
  ) {}

  /**
   * Cria ou atualiza um único registro de fotos para um veículo
   */
  async saveFotos(
    veiculo_id: number,
    fotosData: {
      foto_veiculo?: string[];
      foto_vidros?: string[];
      foto_placa?: string[];
      foto_chassi?: string[];
      foto_motor?: string[];
    },
  ): Promise<FotoVeiculo> {
    // Tenta achar um registro existente
    let fotos = await this.fotoRepo.findOne({ where: { veiculo_id } });

    if (!fotos) {
      // Cria um novo registro se não existir
      fotos = this.fotoRepo.create({ veiculo_id });
    }

    // Atualiza os campos concatenando várias fotos em string separada por vírgula
    fotos.foto_veiculo = fotosData.foto_veiculo?.filter(f => !!f).join(',') || fotos.foto_veiculo || null;
    fotos.foto_vidros = fotosData.foto_vidros?.filter(f => !!f).join(',') || fotos.foto_vidros || null;
    fotos.foto_placa = fotosData.foto_placa?.filter(f => !!f).join(',') || fotos.foto_placa || null;
    fotos.foto_chassi = fotosData.foto_chassi?.filter(f => !!f).join(',') || fotos.foto_chassi || null;
    fotos.foto_motor = fotosData.foto_motor?.filter(f => !!f).join(',') || fotos.foto_motor || null;

    return this.fotoRepo.save(fotos);
  }
}