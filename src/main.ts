import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD
import cors from "cors"
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors())

  app.useGlobalPipes(new ValidationPipe())

  
=======
import { auth } from "express-openid-connect";
import { config as auth0Config } from "./config/auth0.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(auth(auth0Config));
>>>>>>> bc96e41a2645fb492076b9f03daefc1ad844a6b8
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
