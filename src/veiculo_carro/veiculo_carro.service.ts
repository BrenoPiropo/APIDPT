import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from './veiculo_carro.entity';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { Laudo } from '../laudo/laudo.entity';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>,

    @InjectRepository(Laudo)
    private laudoRepository: Repository<Laudo>,
  ) {}

  async create(createVeiculoDto: CreateVeiculoDto): Promise<Veiculo> {
    const { laudoIds, ...veiculoData } = createVeiculoDto;

    // Buscar os Laudos correspondentes
    const laudos = await this.laudoRepository.findByIds(laudoIds);

    // Criar a entidade veiculo já com os laudos
    const veiculo = this.veiculoRepository.create({
      ...veiculoData,
      laudos,
    });

    return await this.veiculoRepository.save(veiculo);
  }

  async findAll(): Promise<Veiculo[]> {
    return this.veiculoRepository.find({ relations: ['laudos'] });
  }

  async findOne(id: number): Promise<Veiculo> {
    return this.veiculoRepository.findOne({
      where: { veiculo_id: id },
      relations: ['laudos'],
    });
  }

  async update(id: number, updateVeiculoDto: Partial<CreateVeiculoDto>): Promise<Veiculo> {
    const veiculo = await this.veiculoRepository.findOne({
      where: { veiculo_id: id },
      relations: ['laudos'],
    });

    if (!veiculo) {
      throw new Error('Veículo não encontrado');
    }

    // Se vier laudoIds, buscar os laudos e atualizar o relacionamento
    if (updateVeiculoDto.laudoIds) {
      const laudos = await this.laudoRepository.findByIds(updateVeiculoDto.laudoIds);
      veiculo.laudos = laudos;
      delete updateVeiculoDto.laudoIds;
    }

    Object.assign(veiculo, updateVeiculoDto);
    return this.veiculoRepository.save(veiculo);
  }

  async remove(id: number): Promise<void> {
    await this.veiculoRepository.delete(id);
  }
}
