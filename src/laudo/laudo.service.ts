import { Injectable, NotFoundException } from '@nestjs/common'; 
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

  // Criar um laudo associando a processo e veículos
  async create(createLaudoDto: CreateLaudoDto): Promise<Laudo> {
    const { veiculoIds, processo_id_processo, ...laudoData } = createLaudoDto;

    // Buscar veículos pelos ids fornecidos
    const veiculos = veiculoIds && veiculoIds.length > 0
      ? await this.veiculoRepository.findByIds(veiculoIds)
      : [];

    // Buscar processo completo
    const processo = await this.processoRepository.findOne({
      where: { id_processo: processo_id_processo },
      relations: ['agente', 'gerente'],
    });

    if (!processo) {
      throw new NotFoundException(`Processo com id ${processo_id_processo} não encontrado`);
    }

    const laudo = this.laudoRepository.create({
      ...laudoData,
      processo,
      veiculos,
    });

    return await this.laudoRepository.save(laudo);
  }

  // Atualizar um laudo e suas associações
  async update(id: number, data: Partial<CreateLaudoDto>): Promise<Laudo> {
    const laudo = await this.laudoRepository.findOne({
      where: { id_laudo: id },
      relations: ['veiculos', 'processo'],
    });

    if (!laudo) {
      throw new NotFoundException(`Laudo com id ${id} não encontrado`);
    }

    // Atualiza os veículos, se fornecidos
    if (data.veiculoIds) {
      const veiculos = await this.veiculoRepository.findByIds(data.veiculoIds);
      laudo.veiculos = veiculos;
    }

    // Atualiza o processo, se fornecido
    if (data.processo_id_processo) {
      const processo = await this.processoRepository.findOne({
        where: { id_processo: data.processo_id_processo },
        relations: ['agente', 'gerente'],
      });

      if (!processo) {
        throw new NotFoundException(`Processo com id ${data.processo_id_processo} não encontrado`);
      }

      laudo.processo = processo;
    }

    // Atualiza os demais campos do laudo
    Object.assign(laudo, data);

    // Limpa propriedades extras que não fazem parte da entidade
    delete (laudo as any).veiculoIds;
    delete (laudo as any).processo_id_processo;

    await this.laudoRepository.save(laudo);

    // Retorna o laudo já formatado
    return this.findOne(id);
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
