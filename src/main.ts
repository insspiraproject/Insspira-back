import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth } from "express-openid-connect";
import cors from "cors"
import { ValidationPipe } from '@nestjs/common';
import { config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true, 
  })
  app.useGlobalPipes(new ValidationPipe())
  app.use(auth(config))

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Insspira API')
    .setDescription('API documentation for Insspira application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}


bootstrap();
