import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AgenteService } from './agente/agente.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('🚀 App is running on http://localhost:3000');
}
bootstrap();
