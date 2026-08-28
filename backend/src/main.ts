import 'dotenv/config';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendDist = join(process.cwd(), '..', 'frontend', 'dist');
  if (existsSync(frontendDist)) {
    app.getHttpAdapter().getInstance().use(express.static(frontendDist));
    app.getHttpAdapter().getInstance().use((request: any, response: any, next: any) => {
      const apiPaths = ['/catalog', '/auth', '/users'];
      if (request.method === 'GET' && !apiPaths.some((path) => request.path.startsWith(path))) {
        response.sendFile(join(frontendDist, 'index.html'));
        return;
      }
      next();
    });
  }
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:5174',
      ].filter(Boolean);
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Origin không được phép'));
    },
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
