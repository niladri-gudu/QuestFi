import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module.js';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import 'dotenv/config';
import type { IncomingMessage, ServerResponse } from 'http';

const expressApp: Express = express();
let isBootstrapped = false;

async function bootstrap() {
  if (isBootstrapped) return;

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  isBootstrapped = true;
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  await bootstrap();
  expressApp(req, res);
};