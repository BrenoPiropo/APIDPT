import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GerenteModule } from './gerente/gerente.module';
import { AgenteModule } from './agente/agente.module';
import { AppService } from './app.service';
import { ProcessoModule } from './processo/processo.module';
import { LaudoController } from './laudo/laudo.controller';
import { LaudoModule } from './laudo/laudo.module';
import { VeiculoService } from './veiculo_carro/veiculo_carro.service';
import { VeiculoModule } from './veiculo_carro/veiculo_carro.module';
import { VeiculoController } from './veiculo_carro/veiculo_carro.controller';
import { AuthModule } from './auth/auth.module';
import { FotoVeiculoModule } from './foto-veiculo/foto_veiculo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'sistema_laudos_test',
      autoLoadEntities: true, 
      synchronize: false, 

    }),
    AgenteModule,
    GerenteModule,
    ProcessoModule,
    LaudoModule,
    VeiculoModule,
    AuthModule,
    FotoVeiculoModule, 
  ],
  providers: [AppService], 
  controllers: [LaudoController], 
})
export class AppModule {}