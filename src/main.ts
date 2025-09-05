// src/main.ts
import { randomUUID } from 'crypto';
import { NestFactory } from '@nestjs/core';
import { AppModulo } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfiguracaoAmbiente } from './configuracao.interface';
import { LoggingInterceptor } from 'logging.interceptor';

// Garantir que crypto.randomUUID esteja disponível para @nestjs/typeorm
if (!globalThis.crypto?.randomUUID) {
  globalThis.crypto = {
    ...globalThis.crypto,
    randomUUID,
  } as Crypto;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModulo);
  const configService = app.get(ConfigService<ConfiguracaoAmbiente>);
  const port = configService.get<number>('PORT', 3000); // 3000 como fallback

  // Habilitar CORS
  // app.enableCors({
  //   origin: true,
  //   credentials: true,
  //   methods: 'GET,POST,PUT,DELETE,OPTIONS', // Métodos permitidos
  // });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.1.3:8081',
      'https://admin-v4-mu.vercel.app',
      'https://admin-v4-git-main-sisdcontis-projects.vercel.app',
    ], // Domínios permitidos
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Métodos permitidos
    credentials: true, // Permitir cookies ou credenciais, se necessário
  });

  // Configurar pipes globais para validação
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(port);
}
void bootstrap();
