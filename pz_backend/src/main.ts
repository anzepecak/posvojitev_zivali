import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // statično serviranje uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  // CORS boš rabil za frontend (Vite), lahko že zdaj:
  app.enableCors({
    origin: ['http://localhost:5173'],
  });

  await app.listen(3000);
}
void bootstrap();
