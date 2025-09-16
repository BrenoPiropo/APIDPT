import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Laudo } from './laudo.entity';
import { Veiculo } from '../veiculo_carro/veiculo_carro.entity';
import { Processo } from '../processo/processo.entity';
import { CreateLaudoDto } from './dto/create-laudo.dto';

@Injectable()
export class LaudoService {
  constructor(
    @InjectRepository(Laudo)
    private readonly laudoRepository: Repository<Laudo>,

    @InjectRepository(Veiculo)
    private readonly veiculoRepository: Repository<Veiculo>,

    @InjectRepository(Processo)
    private readonly processoRepository: Repository<Processo>,
  ) {}

  // Buscar todos os laudos com relações
  findAll() {
    return this.laudoRepository.find({
      relations: ['processo', 'processo.agente', 'processo.gerente', 'veiculos', 'veiculos.fotos'],
    });
  }

  // Buscar um laudo pelo id com relações
  async findOne(id: number): Promise<any> {
    const laudo = await this.laudoRepository.findOne({
      where: { id_laudo: id },
      relations: ['processo', 'processo.agente', 'processo.gerente', 'veiculos', 'veiculos.fotos'],
    });

    if (!laudo) throw new NotFoundException(`Laudo com id ${id} não encontrado`);

    const processo = laudo.processo;

    return {
      id_laudo: laudo.id_laudo,
      numero_inquerito: laudo.numero_inquerito,
      objetivo_pericia: laudo.objetivo_pericia,
      preambulo: laudo.preambulo,
      historico: laudo.historico,
      nome_responsavel: laudo.nome_responsavel,
      autoridade_requisitante: laudo.autoridade_requisitante,
      orgao_requisitante: laudo.orgao_requisitante,
      guia_oficio: laudo.guia_oficio,
      ocorrencia_policial: laudo.ocorrencia_policial,
      processo: processo
        ? {
            id_processo: processo.id_processo,
            status: processo.status,
            prazo: processo.prazo,
            agente: processo.agente
              ? {
                  id_agente: processo.agente.id_agente,
                  nome_agente: processo.agente.nome_agente,
                  email_agente: processo.agente.email_agente,
                }
              : null,
            gerente: processo.gerente
              ? {
                  id_gerente: processo.gerente.id_gerente,
                  nome_gerente: processo.gerente.nome_gerente,
                  email_gerente: processo.gerente.email_gerente,
                }
              : null,
          }
        : null,
      veiculos: laudo.veiculos || [],
    };
  }

  // Criar laudo com veículos associados
  async create(createLaudoDto: CreateLaudoDto): Promise<Laudo> {
    const processo = await this.processoRepository.findOne({
      where: { id_processo: createLaudoDto.processo_id_processo },
      relations: ['agente', 'gerente'],
    });

    if (!processo) throw new NotFoundException('Processo não encontrado');

    // Associar veículos
    let veiculos: Veiculo[] = [];
    if (createLaudoDto.veiculoIds?.length > 0) {
      veiculos = await this.veiculoRepository.findBy({
        veiculo_id: createLaudoDto.veiculoIds as any,
      });
    }

    const laudo = this.laudoRepository.create({
      numero_inquerito: createLaudoDto.numero_inquerito,
      objetivo_pericia: createLaudoDto.objetivo_pericia,
      preambulo: createLaudoDto.preambulo,
      historico: createLaudoDto.historico,
      nome_responsavel: processo.agente?.nome_agente ?? 'Responsável não definido',
      autoridade_requisitante: createLaudoDto.autoridade_requisitante,
      orgao_requisitante: createLaudoDto.orgao_requisitante,
      guia_oficio: createLaudoDto.guia_oficio,
      ocorrencia_policial: createLaudoDto.ocorrencia_policial,
      processo,
      veiculos,
    });

    const laudoSalvo = await this.laudoRepository.save(laudo);
    return this.findOne(laudoSalvo.id_laudo);
  }

  // Atualizar laudo com veículos
  async update(id: number, data: Partial<CreateLaudoDto>): Promise<Laudo> {
    const laudo = await this.laudoRepository.findOne({
      where: { id_laudo: id },
      relations: ['veiculos', 'processo', 'processo.agente', 'processo.gerente'],
    });

    if (!laudo) throw new NotFoundException(`Laudo com id ${id} não encontrado`);

    if (data.veiculoIds?.length > 0) {
      const veiculos = await this.veiculoRepository.findBy({
        veiculo_id: data.veiculoIds as any,
      });
      laudo.veiculos = veiculos;
    }

    if (data.processo_id_processo) {
      const processo = await this.processoRepository.findOne({
        where: { id_processo: data.processo_id_processo },
        relations: ['agente', 'gerente'],
      });
      if (!processo) throw new NotFoundException('Processo não encontrado');
      laudo.processo = processo;
      laudo.nome_responsavel = processo.agente?.nome_agente ?? 'Responsável não definido';
    }

    Object.assign(laudo, data);
    await this.laudoRepository.save(laudo);

    return this.findOne(id);
  }

  async remove(id: number): Promise<Laudo> {
    const laudo = await this.laudoRepository.findOne({ where: { id_laudo: id } });
    if (!laudo) throw new NotFoundException('Laudo não encontrado');
    return this.laudoRepository.remove(laudo);
  }
}
