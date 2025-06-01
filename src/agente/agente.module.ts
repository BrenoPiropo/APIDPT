import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agente } from './agente.entity';
import { AgenteService } from './agente.service';
import { AgenteController } from './agente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Agente])],
  controllers: [AgenteController],
  providers: [AgenteService],
  exports: [AgenteService], 

})
export class AgenteModule {}
