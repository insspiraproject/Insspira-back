// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth } from 'express-openid-connect';
import { ValidationPipe } from '@nestjs/common';
import { config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({
    verify: (req: any, _res, buf) => {
      if (buf && buf.length) req.rawBody = buf.toString();
    },
  }));

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3001',
        'https://api-latest-ejkf.onrender.com',
        // Agrega tu URL de frontend en producción aquí cuando la tengas
      ];
      if (!origin || allowedOrigins.includes(origin)) {
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

  console.log('🔍 Iniciando Auth0...');
  console.log('📍 baseURL (redirect):', config.baseURL);
  console.log('🔍 Configuración de Auth0:', JSON.stringify({
    clientID: config.clientID,
    issuerBaseURL: config.issuerBaseURL,
    audience: config.authorizationParams.audience,
    scope: config.authorizationParams.scope,
  }, null, 2));
  
  app.use(auth({
    ...config,
    session: {
      rolling: true,
      rollingDuration: 24 * 60 * 60, // 24 horas
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'Lax',
      },
    },
    afterCallback: async (req: Request, res: Response): Promise<any> => {
      console.log('🚀 CALLBACK RECIBIDO!');
      console.log('👤 OIDC User completo:', JSON.stringify(req.oidc?.user, null, 2));
      console.log('🔑 OIDC Access Token:', req.oidc?.accessToken?.access_token);

      if (!req.oidc?.user?.sub) {
        console.error('No se encontraron datos del usuario en req.oidc.user');
        res.redirect('http://localhost:3001/login?error=no_user_data');
        return {};
      }

      // Generar token
      const tokenPayload = {
        id: req.oidc.user.sub,
        email: req.oidc.user.email || 'unknown',
        name: req.oidc.user.name || 'User',
        iat: Math.floor(Date.now() / 1000),
      };
      const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

      console.log('🔑 Token generado:', token.substring(0, 20) + '...');
      console.log('🔑 Payload del token:', tokenPayload);

      // Redirigir al frontend
      const frontendUrl = process.env.NODE_ENV === 'production'
        ? 'https://tu-frontend-deploy.com/home' // Cambia esto cuando tengas el deploy
        : 'http://localhost:3001/home';

        console.log('✅ REDIRIGIENDO A:', `${frontendUrl}?token=${token}`);
      res.redirect(`${frontendUrl}?token=${token}`);
      return {};
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
