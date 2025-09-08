import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Expor a pasta uploads como estática
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // acessível em http://localhost:3000/uploads/arquivo.jpg
  });

  await app.listen(3000);
  console.log('🚀 App is running on http://localhost:3000');
}
bootstrap();
