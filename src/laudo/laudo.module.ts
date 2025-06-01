import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LaudoService } from './laudo.service';
import { LaudoController } from './laudo.controller';

import { Laudo } from './laudo.entity';
import { Veiculo } from '../veiculo_carro/veiculo_carro.entity';
import { Processo } from '../processo/processo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Laudo, Veiculo, Processo]),
  ],
  providers: [LaudoService],
  controllers: [LaudoController],
  exports: [LaudoService],
})
export class LaudoModule {}
