import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FotoVeiculo } from './foto_veiculo.entity';
import { FotoVeiculoService } from './foto_veiculo.service';
import { FotoVeiculoController } from './foto_veiculo.controller';
import { Veiculo } from '../veiculo_carro/veiculo_carro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FotoVeiculo, Veiculo])],
  controllers: [FotoVeiculoController],
  providers: [FotoVeiculoService],
  exports: [FotoVeiculoService],
})
export class FotoVeiculoModule {}