import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth } from "express-openid-connect";
import cors from "cors"
import { ValidationPipe } from '@nestjs/common';
import { config } from './config/auth0.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors())

  app.useGlobalPipes(new ValidationPipe())
  app.use(auth(config))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
