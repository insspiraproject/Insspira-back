// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth } from 'express-openid-connect';
import { ValidationPipe } from '@nestjs/common';
import { config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({
    verify: (req: any, _res, buf) => {
      if (buf && buf.length) req.rawBody = buf.toString();
    },
  }));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://api-latest-ejkf.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(auth({
    ...config,
    afterCallback: (req: any, res: any, next: any) => {
      console.log('🚀 CALLBACK RECIBIDO!');
      console.log('👤 Usuario:', {
        id: req.oidc.user?.sub,
        email: req.oidc.user?.email,
        name: req.oidc.user?.name,
      });
      
      // 🔧 IMPORTANTE: LLAMAR next() ANTES del redirect
      if (req.oidc.user) {
        console.log('💾 Usuario sincronizado con DB');
      }
      
      // 🚀 REDIRIGIR AL FRONTEND LOCAL
      const frontendUrl = 'http://localhost:3001/dashboard';
      console.log('✅ REDIRIGIENDO A:', frontendUrl);
      
      // 🔧 LLAMAR next() para que EOIDC termine su proceso
      next();
      
      // 🔧 LUEGO hacer redirect
      return res.redirect(frontendUrl);
    },
  }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Insspira API')
    .setDescription('API documentation for Insspira application')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
