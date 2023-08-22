import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import dotenv, { config } from 'dotenv';
import { AppModule } from './app.module';

config();
const PROXY_PREFIX = process.env.PROXY_PREFIX ?? '';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(PROXY_PREFIX);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: [
      'http://149.154.70.211',
      'http://localhost:5173',
      'http://sila-urala.site',
      'https://sila-urala.site',
    ],
  });
  // app.useGlobalGuards(new RolesGuard());
  await app.listen(3000);
}
bootstrap();
