import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { auth } from "express-openid-connect";
import cors from "cors"
import { ValidationPipe } from '@nestjs/common';
import { config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';


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
    .setDescription(
      'Documentación de la API de Insspira: una aplicación para compartir, descubrir y organizar imágenes de manera social. ' +
      'Los usuarios pueden subir imágenes, crear colecciones, interactuar con contenido mediante “me gusta” y explorar imágenes de otros usuarios. ' +
      'Incluye autenticación, gestión de usuarios y herramientas para filtrar y buscar contenido de forma eficiente.'
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe())
  app.use(auth(config))
  await app.listen(process.env.PORT ?? 3000);
}


bootstrap();
