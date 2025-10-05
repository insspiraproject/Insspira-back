import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth } from 'express-openid-connect';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AuthService } from './auth/auth.service';
import  session from "express-session"
import passport from "passport"
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const authService = app.get(AuthService);

  app.use(bodyParser.json({
    verify: (req: any, _res, buf) => {
      if (buf && buf.length) req.rawBody = buf.toString();
    },
  }));

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://insspira-front-git-develop-insspiras-projects-818b6651.vercel.app', // Prod Vercel
        'https://api-latest-ejkf.onrender.com', // Backend mismo
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
