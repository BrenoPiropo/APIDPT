import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Processo } from './processo.entity';
import { ProcessoService } from './processo.service';
import { ProcessoController } from './processo.controller';
import { AgenteModule } from '../agente/agente.module';
import { GerenteModule } from '../gerente/gerente.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Processo]),
    AgenteModule,
    GerenteModule,
  ],
  controllers: [ProcessoController],
  providers: [ProcessoService],
})
export class ProcessoModule {}
