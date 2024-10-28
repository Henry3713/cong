// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Erlaubt Cross-Origin-Anfragen
  await app.listen(5001, '0.0.0.0');
}
bootstrap();
