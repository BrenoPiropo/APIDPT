import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Processo } from '../processo/processo.entity';

@Entity()
export class Gerente {
  @PrimaryGeneratedColumn({ name: 'id_gerente' })  
  id_gerente: number;

  @Column({ length: 255, nullable: false })
  nome_gerente: string;

  @Column({ length: 255, nullable: false })
  email_gerente: string;

  @Column({ length: 255, nullable: false })
  senha: string;

  @Column({ length: 255, nullable: true })
  laudos_atribuidos: string;

  @OneToMany(() => Processo, (processo) => processo.gerente)
  processos: Processo[];
}
