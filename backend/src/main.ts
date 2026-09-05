import { config } from 'dotenv';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

config({ path: join(process.cwd(), 'backend', '.env') });
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật validation pipe toàn cục (dùng class-validator để validate DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các field không được khai báo trong DTO
      forbidNonWhitelisted: false, // Không throw lỗi khi có field lạ (chỉ bỏ qua)
      transform: true, // Tự động chuyển kiểu dữ liệu (string -> number, etc.)
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('Farm-Farmer API')
    .setDescription('API documentation for the Farm-Farmer system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api-docs', app, documentFactory);

  const frontendDist = join(process.cwd(), '..', 'frontend', 'dist');
  if (existsSync(frontendDist)) {
    app.getHttpAdapter().getInstance().use(express.static(frontendDist));
    app
      .getHttpAdapter()
      .getInstance()
      .use((request: any, response: any, next: any) => {
        const apiPaths = [
          '/catalog',
          '/auth',
          '/users',
          '/farms',
          '/activity-logs',
        ];
        if (
          request.method === 'GET' &&
          !apiPaths.some((path) => request.path.startsWith(path))
        ) {
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
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
      ].filter(Boolean);
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Origin không được phép'));
    },
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`🚀 Backend đang chạy tại http://localhost:${port}`);
}
bootstrap();
