import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import cors from "cors"
import { ValidationPipe } from '@nestjs/common';
import { config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { auth } from 'express-openid-connect';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({
    verify: (req: any, res, buf) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString();
      }
    }
  }));
  
  app.use(cors())
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
