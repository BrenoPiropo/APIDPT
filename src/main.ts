import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));


  await app.listen(3000);
  console.log('🚀 App is running on http://localhost:3000');
}
bootstrap();
