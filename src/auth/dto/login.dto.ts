// src/auth/dto/login.dto.ts
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  nome_agente: string;

  @IsString()
  senha: string;
}
