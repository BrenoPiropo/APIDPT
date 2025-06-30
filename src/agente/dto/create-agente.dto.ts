export class CreateAgenteDto {
  nome_agente: string;
  email_agente: string;
  senha: string;
}
import { IsString, IsEmail } from 'class-validator';