import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Processo } from './processo.entity';
import { CreateProcessoDto } from './dto/create-processo.dto';
import { UpdateProcessoDto } from './dto/update-processo.dto';
import { AgenteService } from '../agente/agente.service';
import { GerenteService } from '../gerente/gerente.service';
import { ProcessoResponseDto } from './dto/processo-response.dto';

@Injectable()
export class ProcessoService {
  constructor(
    @InjectRepository(Processo)
    private processoRepository: Repository<Processo>,
    private agenteService: AgenteService,
    private gerenteService: GerenteService,
  ) {}

  async create(createProcessoDto: CreateProcessoDto) {
    const gerente = await this.gerenteService.findOne(createProcessoDto.gerenteId);
    if (!gerente) {
      throw new NotFoundException(`Gerente com id ${createProcessoDto.gerenteId} não encontrado`);
    }

    const agente = await this.agenteService.findOne(createProcessoDto.agenteId);
    if (!agente) {
      throw new NotFoundException(`Agente com id ${createProcessoDto.agenteId} não encontrado`);
    }

    const processo = this.processoRepository.create({
      status: createProcessoDto.status,
      prazo: createProcessoDto.prazo,
      gerente,
      agente,
    });

    return this.processoRepository.save(processo);
  }

async findAll(): Promise<ProcessoResponseDto[]> {
  const processos = await this.processoRepository.find({
    relations: ['agente', 'gerente'],
  });

  return processos.map((p) => ({
    id: p.id_processo,
    status: p.status,
    prazo: p.prazo,
    agente: {
      id_agente: p.agente.id_agente,
      nome_agente: p.agente.nome_agente,
    },
    gerente: {
      id_gerente: p.gerente.id_gerente,
      nome_gerente: p.gerente.nome_gerente,
    },
  }));
}

 async findOne(id_processo: number): Promise<ProcessoResponseDto> {
  const processo = await this.processoRepository.findOne({
    where: { id_processo },
    relations: ['agente', 'gerente'],
  });

  if (!processo) {
    throw new NotFoundException('Processo não encontrado');
  }

  return {
    id: processo.id_processo,
    status: processo.status,
    prazo: processo.prazo,
    agente: {
      id_agente: processo.agente.id_agente,
      nome_agente: processo.agente.nome_agente,
    },
    gerente: {
      id_gerente: processo.gerente.id_gerente,
      nome_gerente: processo.gerente.nome_gerente,
    },
  };
}

  async update(id: number, updateDto: UpdateProcessoDto): Promise<Processo> {
    const processo = await this.processoRepository.findOne({ where: { id_processo: id }, relations: ['agente', 'gerente'] });
    if (!processo) {
      throw new NotFoundException('Processo não encontrado');
    }

    if (updateDto.gerenteId) {
      processo.gerente = await this.gerenteService.findOne(updateDto.gerenteId);
    }

    if (updateDto.agenteId) {
      processo.agente = await this.agenteService.findOne(updateDto.agenteId);
    }

    if (updateDto.status !== undefined) processo.status = updateDto.status;
    if (updateDto.prazo !== undefined) processo.prazo = updateDto.prazo;

    return this.processoRepository.save(processo);
  }


  async remove(id: number): Promise<void> {
    const result = await this.processoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Processo não encontrado');
    }
  }
}
