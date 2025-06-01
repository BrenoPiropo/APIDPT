import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Processo } from '../processo/processo.entity';

@Entity()
export class Agente {
  @PrimaryGeneratedColumn({ name: 'id_agente' })  
  id_agente: number;

  @Column({ length: 255, nullable: true })
  nome_agente: string;

  @Column({ length: 45, nullable: true })
  email_agente: string;

  @Column({ length: 45, nullable: true })
  senha: string;

  @Column({ length: 255, nullable: true })
  laudos_recebidos: string;

  @OneToMany(() => Processo, (processo) => processo.agente)
  processos: Processo[];
}

