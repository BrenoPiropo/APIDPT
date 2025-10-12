import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateConsultaExternaDto {
  @IsNotEmpty()
  @IsString()
  descricao_placa: string;

  @IsNotEmpty()
  @IsString()
  vin: string;

  @IsNotEmpty()
  @IsString()
  marca_modelo: string;

  @IsNotEmpty()
  @IsString()
  categoria_consulta: string;

  @IsNotEmpty()
  @IsString()
  cor_consulta: string;

  @IsNotEmpty()
  @IsString()
  serie_motor_consulta: string;

  @IsNotEmpty()
  @IsString()
  licenciado_em_nome_de: string;

  @IsNotEmpty()
  @IsNumber()
  laudo_id_consulta: number;
}
