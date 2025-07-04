import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Laudo } from '../laudo/laudo.entity';

@Entity('veiculo_carro')
export class Veiculo {
  @PrimaryGeneratedColumn({ name: 'veiculo_id' })
  veiculo_id: number;

  @Column({ nullable: true, length: 255 })
  marca?: string;

  @Column({ nullable: true, length: 45 })
  cor?: string;

  @Column({ nullable: true, length: 45 })
  id_vidros?: string;

  @Column({ nullable: true, length: 45 })
  descricao_vidros?: string;

  @Column({ nullable: true, length: 45 })
  id_motor?: string;

  @Column({ nullable: true, length: 45 })
  descricao_motor?: string;

  @Column({ nullable: true, length: 45 })
  num_placa?: string;

  @Column({ nullable: true, length: 45 })
  tipo_placa?: string;

  @Column({ nullable: true, length: 45 })
  descricao_placa?: string;

  @Column({ nullable: true, length: 45 })
  num_chassi?: string;

  @Column({ nullable: true, length: 45 })
  descricao_chassi?: string;

  @Column({ nullable: true, length: 45 })
  outras_numeracoes?: string;

  @Column({ nullable: true, length: 45 })
  dados_central_eletronica?: string;

  @Column({ nullable: true, length: 45 })
  etiquetas?: string;

  @Column({ nullable: true, length: 45 })
  plaquetas_ano_fabricacao?: string;

  @Column({ type: 'text', nullable: true })
  condicoes_tecnicas?: string;

  @Column({ type: 'text', nullable: true })
  conclusao?: string;

  @ManyToMany(() => Laudo, (laudo) => laudo.veiculos, { cascade: true })
  @JoinTable({
    name: 'veiculo_carro_has_laudo',
    joinColumn: {
      name: 'fk_veiculo_id',
      referencedColumnName: 'veiculo_id',
    },
    inverseJoinColumn: {
      name: 'fk_laudo_id',
      referencedColumnName: 'id_laudo',
    },
  })
  laudos: Laudo[];
}
