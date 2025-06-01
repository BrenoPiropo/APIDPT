import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agente } from './agente.entity';
import { CreateAgenteDto } from './dto/create-agente.dto';
import { UpdateAgenteDto } from './dto/update-agente.dto';

@Injectable()
export class AgenteService {
  constructor(
    @InjectRepository(Agente)
    private agenteRepository: Repository<Agente>,
  ) {}

  create(createDto: CreateAgenteDto): Promise<Agente> {
    const agente = this.agenteRepository.create(createDto);
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

  async update(id: number, updateDto: UpdateAgenteDto): Promise<Agente> {
    await this.agenteRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id_agente: number): Promise<void> {
    await this.agenteRepository.delete(id_agente);
  }
  async login(nome: string, senha: string): Promise<Agente | null> {
  const agente = await this.agenteRepository.findOne({ where: { nome_agente: nome, senha } });
  return agente || null;
}

}
