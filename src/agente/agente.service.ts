import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agente } from './agente.entity';
import { CreateAgenteDto } from './dto/create-agente.dto';
import { UpdateAgenteDto } from './dto/update-agente.dto';
import { Laudo } from '../laudo/laudo.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AgenteService {
  constructor(
    @InjectRepository(Agente)
    private agenteRepository: Repository<Agente>,

    @InjectRepository(Laudo)
    private laudoRepository: Repository<Laudo>,
  ) {}
  async findByNome(nome: string): Promise<Agente | undefined> {
    return this.agenteRepository.findOne({ where: { nome_agente: nome } });
  }
async create(createDto: CreateAgenteDto): Promise<Agente> {
  const hashedSenha = await bcrypt.hash(createDto.senha, 10);

  const agente = this.agenteRepository.create({
    ...createDto,
    senha: hashedSenha,
  });

  return this.agenteRepository.save(agente);
}




  findAll(): Promise<Agente[]> {
    return this.agenteRepository.find();
  }

  async findOne(id: number): Promise<Agente> {
    return this.agenteRepository.findOne({
      where: { id_agente: id },
    });
  }

  // Novo método que retorna o agente com a lista de IDs dos laudos recebidos
  async findOneWithLaudos(id: number): Promise<any> {
    const agente = await this.agenteRepository.findOne({
      where: { id_agente: id },
    });

    if (!agente) {
      throw new Error('Agente não encontrado');
    }

    // Buscar os laudos cujo processo tem agenteIdAgente igual ao id
    const laudos = await this.laudoRepository
      .createQueryBuilder('laudo')
      .innerJoin('laudo.processo', 'processo')
      .where('processo.agenteIdAgente = :id', { id })
      .getMany();

    const laudos_recebidos = laudos.map((laudo) => laudo.id_laudo);

    return {
      ...agente,
      laudos_recebidos,
    };
  }

  async update(id: number, updateDto: UpdateAgenteDto): Promise<Agente> {
    await this.agenteRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id_agente: number): Promise<void> {
    await this.agenteRepository.delete(id_agente);
  }

async login(nome: string, senha: string): Promise<Agente> {
  const agente = await this.agenteRepository.findOne({ where: { nome_agente: nome } });
  if (!agente) {
    console.log('Usuário não encontrado:', nome);
    throw new UnauthorizedException('Usuário não encontrado');
  }

  console.log('Senha recebida:', senha);
  console.log('Senha hash armazenada:', agente.senha);
    
  const passwordValid = await bcrypt.compare(senha, agente.senha);
  console.log('Senha válida?', passwordValid);


  if (!passwordValid) {
    throw new UnauthorizedException('Senha inválida');
  }

  return agente;
}



}
