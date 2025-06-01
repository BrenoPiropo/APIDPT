import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProcessoDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  prazo: string;

  @IsNumber()
  @IsNotEmpty()
  gerenteId: number;

  @IsNumber()
  @IsNotEmpty()
  agenteId: number;
}
