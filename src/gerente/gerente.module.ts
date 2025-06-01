import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gerente } from './gerente.entity';
import { GerenteService } from './gerente.service';
import { GerenteController } from './gerente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Gerente])],
  providers: [GerenteService],
  controllers: [GerenteController],
  exports: [GerenteService], 

})
export class GerenteModule {}
