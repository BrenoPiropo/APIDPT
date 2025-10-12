import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultaExterna } from './consulta_externa.entity';
import { Laudo } from '../laudo/laudo.entity';
import { CreateConsultaExternaDto } from './dto/create-consulta-externa.dto';

@Injectable()
export class ConsultaExternaService {
  constructor(
    @InjectRepository(ConsultaExterna)
    private readonly consultaRepo: Repository<ConsultaExterna>,

    @InjectRepository(Laudo)
    private readonly laudoRepo: Repository<Laudo>,
  ) {}

  async findAll() {
    return this.consultaRepo.find({ relations: ['laudo'] });
  }

  async findOne(id: number) {
    const consulta = await this.consultaRepo.findOne({ where: { id_consulta: id }, relations: ['laudo'] });
    if (!consulta) throw new NotFoundException(`Consulta externa ${id} não encontrada`);
    return consulta;
  }

  async create(dto: CreateConsultaExternaDto) {
    const laudo = await this.laudoRepo.findOne({ where: { id_laudo: dto.laudo_id_consulta } });
    if (!laudo) throw new NotFoundException('Laudo não encontrado');

    const consulta = this.consultaRepo.create({
      ...dto,
      laudo,
    });
    return this.consultaRepo.save(consulta);
  }

  async remove(id: number) {
    const consulta = await this.findOne(id);
    return this.consultaRepo.remove(consulta);
  }
}
