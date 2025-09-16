import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Laudo } from '../laudo/laudo.entity';
import { FotoVeiculo } from '../foto-veiculo/foto_veiculo.entity';

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

  @Column({ type: 'varchar', length: 45, nullable: true })
  licenciado_em_nome?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  categoria?: string;
  @Column({ type: 'varchar', length: 45, nullable: true })
  observacoes_placa?: string;

  @ManyToMany(() => Laudo, laudo => laudo.veiculos, { cascade: true })
  laudos: Laudo[];
  
  @OneToMany(() => FotoVeiculo, (foto) => foto.veiculo, { cascade: true })
  fotos: FotoVeiculo[];
}