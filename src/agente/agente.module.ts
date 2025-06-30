import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agente } from './agente.entity';
import { AgenteService } from './agente.service';
import { AgenteController } from './agente.controller';
import { Laudo } from '../laudo/laudo.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agente, Laudo]),
    forwardRef(() => AuthModule),  // Usa forwardRef para quebrar a circularidade
  ],
  controllers: [AgenteController],
  providers: [AgenteService],
  exports: [AgenteService, TypeOrmModule],
})
export class AgenteModule {}
