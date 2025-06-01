import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gerente } from './gerente.entity';
import { UpdateGerenteDto } from './dto/update-gerente.dto';
import { CreateGerenteDto } from './dto/create-gerente.dto';
@Injectable()
export class GerenteService {
  constructor(
    @InjectRepository(Gerente)
    private readonly gerenteRepository: Repository<Gerente>,
  ) {}

  // Criar um novo Gerente
  async create(createDto: CreateGerenteDto): Promise<Gerente> {
    const gerente = this.gerenteRepository.create(createDto);
    return await this.gerenteRepository.save(gerente);
  }

  // Encontrar todos os Gerentes
  async findAll(): Promise<Gerente[]> {
    return this.gerenteRepository.find();
  }

async findOne(id: number): Promise<Gerente> {
  return this.gerenteRepository.findOne({
    where: { id_gerente: id },
  });
}



  // Atualizar um Gerente
  async update(id: number, updateDto: UpdateGerenteDto): Promise<Gerente> {
    await this.gerenteRepository.update(id, updateDto);
    return this.findOne(id);
  }

  // Remover um Gerente
  async remove(id: number): Promise<void> {
    await this.gerenteRepository.delete(id);
  }
}
