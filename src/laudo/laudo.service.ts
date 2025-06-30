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

  // Buscar todos os laudos com suas relações (processo, agente, gerente, veículos)
  findAll() {
    return this.laudoRepository.find({
      relations: ['processo', 'processo.agente', 'processo.gerente', 'veiculos'],
    });
  }

  // Buscar um laudo pelo id, incluindo relações e filtrando dados do processo
  async findOne(id: number): Promise<any> {
    const laudo = await this.laudoRepository.findOne({
      where: { id_laudo: id },
      relations: ['processo', 'processo.agente', 'processo.gerente', 'veiculos'],
    });

    if (!laudo) {
      throw new NotFoundException(`Laudo com id ${id} não encontrado`);
    }

    if (!laudo.processo) {
      return laudo;
    }

    const processo = laudo.processo;

    // Retornar laudo com processo formatado, mantendo só os campos desejados
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

      processo: {
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
      },

      veiculos: laudo.veiculos || [],
    };
  }

async create(createLaudoDto: CreateLaudoDto): Promise<Laudo> {
  if (createLaudoDto.processo_id_processo < 10) {
    throw new ConflictException('Processos com ID menor que 10 não são aceitos em produção');
  }

  // Buscar processo com agente e gerente
  const processo = await this.processoRepository.findOne({
    where: { id_processo: createLaudoDto.processo_id_processo },
    relations: ['agente', 'gerente', 'laudo'],
  });

  if (!processo) {
    throw new NotFoundException('Processo não encontrado');
  }

  if (processo.laudo) {
    throw new ConflictException('Já existe um laudo associado a esse processo');
  }

  const laudo = this.laudoRepository.create({
    numero_inquerito: createLaudoDto.numero_inquerito,
    objetivo_pericia: createLaudoDto.objetivo_pericia,
    preambulo: createLaudoDto.preambulo,
    historico: createLaudoDto.historico,
    nome_responsavel: processo.agente?.nome_agente ?? 'Responsável não definido',  // Proteção caso agente seja null
    autoridade_requisitante: createLaudoDto.autoridade_requisitante,
    orgao_requisitante: createLaudoDto.orgao_requisitante,
    guia_oficio: createLaudoDto.guia_oficio,
    ocorrencia_policial: createLaudoDto.ocorrencia_policial,
    processo: processo,
  });

  return this.laudoRepository.save(laudo);
}

  async update(id: number, data: Partial<CreateLaudoDto>): Promise<Laudo> {
  const laudo = await this.laudoRepository.findOne({
    where: { id_laudo: id },
    relations: ['veiculos', 'processo', 'processo.agente'],
  });

  if (!laudo) {
    throw new NotFoundException(`Laudo com id ${id} não encontrado`);
  }

  if (data.veiculoIds) {
    const veiculos = await this.veiculoRepository.findByIds(data.veiculoIds);
    laudo.veiculos = veiculos;
  }

  if (data.processo_id_processo) {
    const processo = await this.processoRepository.findOne({
      where: { id_processo: data.processo_id_processo },
      relations: ['agente', 'gerente'],
    });

    if (!processo) {
      throw new NotFoundException(`Processo com id ${data.processo_id_processo} não encontrado`);
    }

    laudo.processo = processo;
    laudo.nome_responsavel = processo.agente?.nome_agente ?? 'Responsável não definido'; // Atualiza o nome_responsavel no update
  }

  Object.assign(laudo, data);

  delete (laudo as any).veiculoIds;
  delete (laudo as any).processo_id_processo;

  await this.laudoRepository.save(laudo);

  return this.findOne(id);
}
async findLaudosPendentesDoAgente(id_agente: number): Promise<Laudo[]> {
    return this.laudoRepository
      .createQueryBuilder('laudo')
      .innerJoinAndSelect('laudo.processo', 'processo')
      .innerJoinAndSelect('processo.agente', 'agente')
      .innerJoinAndSelect('processo.gerente', 'gerente')
      .leftJoinAndSelect('laudo.veiculos', 'veiculos')
      .where('agente.id_agente = :id_agente', { id_agente })
      .andWhere('processo.status = :status', { status: 'pendente' })
      .getMany();
  }
// Remover um laudo
async remove(id: number): Promise<Laudo> {
  const laudo = await this.laudoRepository.findOne({ where: { id_laudo: id } });
  if (!laudo) {
    throw new NotFoundException('Laudo não encontrado');
  }
  return await this.laudoRepository.remove(laudo);
}
}
