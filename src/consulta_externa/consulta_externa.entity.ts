import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Laudo } from '../laudo/laudo.entity';

@Entity()
export class ConsultaExterna {
    @PrimaryGeneratedColumn({ name: 'id_consulta_externa' })
    id_consulta: number;

  @Column({ length: 45 })
  descricao_placa: string;

  @Column({ length: 45 })
  vin: string;

  @Column({ length: 45 })
  marca_modelo: string;

  @Column({ length: 45 })
  categoria_consulta: string;

  @Column({ length: 45 })
  cor_consulta: string;

  @Column({ length: 45 })
  serie_motor_consulta: string;

  @Column({ length: 45 })
  licenciado_em_nome_de: string;

  @ManyToOne(() => Laudo, laudo => laudo.consultaExterna, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'laudo_id_consulta' })
  laudo: Laudo;
}
