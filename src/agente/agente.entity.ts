import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Processo } from '../processo/processo.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class Agente {
  @PrimaryGeneratedColumn({ name: 'id_agente' })  
  id_agente: number;

  @Column({ length: 255, nullable: true })
  nome_agente: string;

  @Column({ length: 45, nullable: true })
  email_agente: string;

  @Column({ length: 255, nullable: true })
  senha: string;

  @Column({ length: 255, nullable: true })
  laudos_recebidos: string;
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.senha) {
      const isHashed = this.senha.startsWith('$2b$10$');
      if (!isHashed) {
        this.senha = await bcrypt.hash(this.senha, 10);
      }
    }
  }

  @OneToMany(() => Processo, (processo) => processo.agente)
  processos: Processo[];
}

