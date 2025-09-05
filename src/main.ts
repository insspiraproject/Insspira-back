import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth } from "express-openid-connect";
import { config as auth0Config } from "./config/auth0.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(auth(auth0Config));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
