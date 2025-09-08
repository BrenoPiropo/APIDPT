import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Veiculo } from '../veiculo_carro/veiculo_carro.entity';

@Entity('foto_veiculo')
export class FotoVeiculo {
  @PrimaryGeneratedColumn()
  foto_id: number;

  @Column({ type: 'text', nullable: true })
  foto_veiculo: string;

  @Column({ type: 'text', nullable: true })
  foto_vidros: string;

  @Column({ type: 'text', nullable: true })
  foto_placa: string;

  @Column({ type: 'text', nullable: true })
  foto_chassi: string;

  @Column({ type: 'text', nullable: true })
  foto_motor: string;

  @Column()
  veiculo_id: number;

  @ManyToOne(() => Veiculo, veiculo => veiculo.fotos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'veiculo_id' })
  veiculo: Veiculo;
}
