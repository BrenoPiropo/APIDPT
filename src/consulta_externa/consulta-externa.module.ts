import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultaExterna } from './consulta_externa.entity';
import { ConsultaExternaService } from './consulta-externa.service';
import { ConsultaExternaController } from './consulta-externa.controller';
import { Laudo } from '../laudo/laudo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultaExterna, Laudo])],
  controllers: [ConsultaExternaController],
  providers: [ConsultaExternaService],
  exports: [ConsultaExternaService],
})
export class ConsultaExternaModule {}
