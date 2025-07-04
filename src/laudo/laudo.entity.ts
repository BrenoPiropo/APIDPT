import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Processo } from '../processo/processo.entity';
import { Veiculo } from '../veiculo_carro/veiculo_carro.entity';

@Entity()
export class Laudo {
  @PrimaryGeneratedColumn()
  id_laudo: number;

  @Column()
  numero_inquerito: string;

  @Column()
  objetivo_pericia: string;

  @Column()
  preambulo: string;

  @Column()
  historico: string;

  @Column()
  nome_responsavel: string;

  @Column()
  autoridade_requisitante: string;

  @Column()
  orgao_requisitante: string;

  @Column()
  guia_oficio: string;

  @Column()
  ocorrencia_policial: string;

  @OneToOne(() => Processo, { eager: true })
  @JoinColumn({ name: 'processo_id_processo' }) 
  processo: Processo;
  @ManyToMany(() => Veiculo, (veiculo) => veiculo.laudos)
  veiculos: Veiculo[];
}

  
