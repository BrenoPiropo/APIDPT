import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateVeiculoDto {
  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  cor?: string;

  @IsOptional()
  @IsString()
  id_vidros?: string;

  @IsOptional()
  @IsString()
  descricao_vidros?: string;

  @IsOptional()
  @IsString()
  id_motor?: string;

  @IsOptional()
  @IsString()
  descricao_motor?: string;

  @IsOptional()
  @IsString()
  num_placa?: string;
  @IsOptional()
  @IsString()
  num_motor?: string;


  @IsOptional()
  @IsString()
  tipo_placa?: string;

  @IsOptional()
  @IsString()
  descricao_placa?: string;

  @IsOptional()
  @IsString()
  num_chassi?: string;

  @IsOptional()
  @IsString()
  descricao_chassi?: string;

  @IsOptional()
  @IsString()
  outras_numeracoes?: string;

  @IsOptional()
  @IsString()
  dados_central_eletronica?: string;

  @IsOptional()
  @IsString()
  etiquetas?: string;

  @IsOptional()
  @IsString()
  plaquetas_ano_fabricacao?: string;

  @IsNotEmpty()
  @IsNumber()
  laudoIds: number[];  
}
