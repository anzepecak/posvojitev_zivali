import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Globalni prefix za vse rute: /api/...
  app.setGlobalPrefix('api');

  // Globalna validacija DTO-jev
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Večji limiti za JSON / form
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Statično serviranje /uploads (npr. slike)
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  // CORS za Vite frontend + Bearer JWT (Authorization header)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  // Health endpoint: GET /health
  app.getHttpAdapter().get('/health', (_req: any, res: Response) => {
    res.status(200).send({ status: 'ok' });
  });

  const port = 3000;
  await app.listen(port);

  const url = await app.getUrl();
  console.log(`🚀 Backend running at: ${url}`);
  console.log(`📚 API base: ${url}/api`);
  console.log(`🩺 Health: ${url}/health`);
  console.log(`🖼️  Uploads: ${url}/uploads/<filename>`);
}

void bootstrap();
