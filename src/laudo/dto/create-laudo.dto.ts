import { IsNotEmpty, IsString, IsNumber, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateLaudoDto {
  @IsNotEmpty()
  @IsString()
  numero_inquerito: string;

  @IsNotEmpty()
  @IsString()
  objetivo_pericia: string;

  @IsNotEmpty()
  @IsString()
  preambulo: string;

  @IsNotEmpty()
  @IsString()
  historico: string;

  @IsNotEmpty()
  @IsString()
  nome_responsavel: string;

  @IsNotEmpty()
  @IsString()
  autoridade_requisitante: string;

  @IsNotEmpty()
  @IsString()
  orgao_requisitante: string;

  @IsNotEmpty()
  @IsString()
  guia_oficio: string;

  @IsNotEmpty()
  @IsString()
  ocorrencia_policial: string;

  @IsNotEmpty()
  @IsNumber()
  processo_id_processo: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  veiculoIds: number[];
}
