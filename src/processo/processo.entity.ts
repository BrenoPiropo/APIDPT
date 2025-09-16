// src/processo/processo.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Agente } from '../agente/agente.entity';
import { Gerente } from '../gerente/gerente.entity';

@Entity()
export class Processo {
  @PrimaryGeneratedColumn()
  id_processo: number;

  @Column({ 
    type: 'varchar',
    length: 45,
    nullable: false,
    default: 'pendente',
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    default: '2025-12-31',
  })
  prazo: string;

  @ManyToOne(() => Gerente, (gerente) => gerente.processos, { eager: true })
  @JoinColumn({ name: 'gerenteIdGerente' }) // FK para gerente
  gerente: Gerente;

  @ManyToOne(() => Agente, (agente) => agente.processos, { eager: true })
  @JoinColumn({ name: 'agenteIdAgente' }) // FK para agente
  agente: Agente;

}
