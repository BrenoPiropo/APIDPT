// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GerenteModule } from './gerente/gerente.module';
import { AgenteModule } from './agente/agente.module';
import { AppService } from './app.service';
import { ProcessoModule } from './processo/processo.module';
import { LaudoController } from './laudo/laudo.controller';
import { LaudoModule } from './laudo/laudo.module';
import { VeiculoModule } from './veiculo_carro/veiculo_carro.module';
import { AuthModule } from './auth/auth.module';
import { FotoVeiculoModule } from './foto-veiculo/foto_veiculo.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ConsultaExternaModule } from './consulta_externa/consulta-externa.module';
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
    ConsultaExternaModule,
  ],
  controllers: [LaudoController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, 
    },
  ],
})
export class AppModule {}
