import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    } catch (err) {
      console.error('❌ Falha ao conectar com o banco de dados:', err);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
