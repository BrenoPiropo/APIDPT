// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Agente } from '../agente/agente.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Agente)
    private agenteRepository: Repository<Agente>,
    private jwtService: JwtService,
  ) {}

async validateUser(nome_agente: string, senha: string): Promise<any> {
  console.log('Validando usuário:', nome_agente);

  const agente = await this.agenteRepository
    .createQueryBuilder('agente')
    .where('BINARY agente.nome_agente = :nome', { nome: nome_agente })
    .getOne();

  if (!agente) {
    console.log('Usuário não encontrado');
    return null;
  }

  const passwordValid = await bcrypt.compare(senha, agente.senha);
  console.log('Senha válida?', passwordValid);

  if (passwordValid) {
    const { senha, ...result } = agente;
    return result;
  }

  return null;
}


async login(nome: string, senha: string): Promise<{ agente: Agente; token: string }> {
  console.log('Login chamado para:', nome);

  const agente = await this.agenteRepository
    .createQueryBuilder('agente')
    .where('BINARY agente.nome_agente = :nome', { nome })
    .getOne();

  if (!agente) {
    console.log('Usuário não encontrado no login');
    throw new UnauthorizedException('Usuário não encontrado');
  }

  const passwordValid = await bcrypt.compare(senha, agente.senha);
  console.log('Senha válida no login?', passwordValid);
  if (!passwordValid) {
    throw new UnauthorizedException('Senha inválida');
  }

  const token = this.jwtService.sign({ sub: agente.id_agente, nome_agente: agente.nome_agente });
  console.log('Token gerado:', token);

  return { agente, token };
}


}
