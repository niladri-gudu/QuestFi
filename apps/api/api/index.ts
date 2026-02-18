// apps/api/api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module.js';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import 'dotenv/config';

const server = express();
let app: any;

async function bootstrap() {
  if (app) return server;

  app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  return server;
}

export default async (req: any, res: any) => {
  await bootstrap();
  server(req, res);
};
