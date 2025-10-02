// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth } from 'express-openid-connect';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AuthService } from './auth/auth.service';
import  session from "express-session"
import cookieParser from 'cookie-parser';
import passport from "passport"


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const authService = app.get(AuthService);

  app.use(bodyParser.json({
    verify: (req: any, _res, buf) => {
      if (buf && buf.length) req.rawBody = buf.toString();
    },
  }));

  app.use(cookieParser());
  app.use(passport.initialize());

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3001', 
        'insspira-front-git-develop-insspiras-projects-818b6651.vercel.app', // Prod Vercel
        'https://api-latest-ejkf.onrender.com', // Backend mismo
      ];
      if (!origin || allowedOrigins.includes(origin)|| /^https?:\/\/.*\.vercel\.app$/.test(origin)) {
        console.log(`CORS allowed for origin: ${origin}`);
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.useGlobalPipes(new ValidationPipe());

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

