export class ProcessoResponseDto {
  id: number;
  status: string;
  prazo: string;
  agente: {
    id_agente: number;
    nome_agente: string;
  };
   gerente: {
    id_gerente: number;
    nome_gerente: string;
  };
}

