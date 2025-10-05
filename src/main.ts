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

  app.use(bodyParser.json({
    verify: (req: any, _res, buf) => {
      if (buf && buf.length) req.rawBody = buf.toString();
    },
  }));

<<<<<<< HEAD
  // app.enableCors({
  //   origin: (origin, callback) => {
  //     const allowedOrigins = [
  //       'http://localhost:3001', 
  //       'https://insspira-front-git-vercel-insspiras-projects-818b6651.vercel.app', // Prod Vercel
  //       'https://api-latest-ejkf.onrender.com', // Backend mismo
  //     ];
  //     if (!origin || allowedOrigins.includes(origin)|| /^https?:\/\/.*\.vercel\.app$/.test(origin)) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   credentials: true, // Importante para cookies/sessions
  //   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  // });
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3001', 
        'http://localhost:3000', 
        'https://insspira-front.vercel.app', 
        'https://insspira-front-git-vercel-insspiras-projects-818b6651.vercel.app',
        'https://api-latest-ejkf.onrender.com',
=======

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3001",
        'https://insspira-front-git-develop-insspiras-projects-818b6651.vercel.app',
        'https://api-latest-ejkf.onrender.com', // Backend mismo
>>>>>>> add830e75ae61cba4c9f849d7bf863da66a7171c
      ];
      
      // Para desarrollo, permitir cualquier origen localhost
      const isLocalhost = origin && origin.includes('localhost');
      const isAllowed = !origin || allowedOrigins.includes(origin) || isLocalhost;
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log('CORS bloqueado para origen:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
<<<<<<< HEAD
=======
    
>>>>>>> add830e75ae61cba4c9f849d7bf863da66a7171c
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'Cookie',
      'Set-Cookie'
    ],
    exposedHeaders: ['Set-Cookie', 'Cookie'],
  });

  app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());






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

