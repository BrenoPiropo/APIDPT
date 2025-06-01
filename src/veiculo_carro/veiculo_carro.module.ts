import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veiculo } from './veiculo_carro.entity';
import { VeiculoService } from './veiculo_carro.service';
import { VeiculoController } from './veiculo_carro.controller';
import { Laudo } from '../laudo/laudo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Veiculo, Laudo])],
  providers: [VeiculoService],
  controllers: [VeiculoController],
  exports: [VeiculoService],
})
export class VeiculoModule {}
