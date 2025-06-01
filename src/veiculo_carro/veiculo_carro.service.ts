import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from './veiculo_carro.entity';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
import { Laudo } from '../laudo/laudo.entity';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>,

    @InjectRepository(Laudo)
    private laudoRepository: Repository<Laudo>,
  ) {}

  findAll(): Promise<Veiculo[]> {
    return this.veiculoRepository.find({ relations: ['laudos'] });
  }

  async findOne(id: number): Promise<Veiculo> {
    const veiculo = await this.veiculoRepository.findOne({
      where: { veiculo_id: id },
      relations: ['laudos'],
    });
    if (!veiculo) {
      throw new NotFoundException(`Veículo com id ${id} não encontrado`);
    }
    return veiculo;
  }

async create(dto: CreateVeiculoDto): Promise<Veiculo> {
  const { laudoIds, ...dados } = dto;

  const laudos = await this.laudoRepository.findByIds(laudoIds);

  const veiculo = this.veiculoRepository.create({
    ...dados,
    laudos,
  });

  return await this.veiculoRepository.save(veiculo);
}
  async update(id: number, updateVeiculoDto: UpdateVeiculoDto): Promise<Veiculo> {
    const veiculo = await this.findOne(id);
    Object.assign(veiculo, updateVeiculoDto);
    return this.veiculoRepository.save(veiculo);
  }

  async remove(id: number): Promise<void> {
    const veiculo = await this.findOne(id);
    await this.veiculoRepository.remove(veiculo);
  }
}
