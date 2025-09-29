// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth } from 'express-openid-connect';
import { ValidationPipe } from '@nestjs/common';
import { config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { AuthService } from './auth/auth.service';


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
        'http://localhost:3001', 
        'https://insspira-front-git-vercel-insspiras-projects-818b6651.vercel.app', // Prod Vercel
        'https://api-latest-ejkf.onrender.com', // Backend mismo
      ];
      if (!origin || allowedOrigins.includes(origin)|| /^https?:\/\/.*\.vercel\.app$/.test(origin)) {
        console.log(`CORS allowed for origin: ${origin}`);
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Importante para cookies/sessions
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.useGlobalPipes(new ValidationPipe());

  console.log('🔍 Iniciando Auth0...');
  console.log('📍 baseURL (redirect):', config.baseURL);
  console.log('🔍 Configuración de Auth0:', JSON.stringify({
    clientID: config.clientID,
    issuerBaseURL: config.issuerBaseURL,
    //audience: config.authorizationParams.audience,
    scope: config.authorizationParams.scope,
  }, null, 2));
  
  app.use(auth({
    ...config,
    clientAuthMethod: 'client_secret_post',
    session: {
      rolling: true,
      rollingDuration: 24 * 60 * 60,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS en prod
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // None para cross-site en prod
      },
    },
    afterCallback: async (req: Request, res: Response): Promise<any> => {
      console.log('🚀 CALLBACK RECIBIDO!');
      console.log('👤 OIDC Complete:', JSON.stringify(req.oidc, null, 2));
      console.log('👤 OIDC User:', JSON.stringify(req.oidc?.user, null, 2));
      console.log('🔑 OIDC Access Token:', req.oidc?.accessToken?.access_token);

      if (!req.oidc) {
        console.error('No OIDC data received');
        throw new Error('no_oidc_data');
      }
    
      if (!req.oidc.user || !req.oidc.user.sub) {
        console.error('No user or sub in OIDC:', JSON.stringify(req.oidc.user, null, 2));
        throw new Error('no_user_sub');
      }

      // Inyecta JwtService si no lo tienes accesible (mejor mover esta lógica a AuthService)
      const token = await authService.generateToken({
        id: req.oidc.user.sub,
        email: req.oidc.user.email || 'unknown',
        name: req.oidc.user.name || 'User',
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      console.log('✅ REDIRIGIENDO A:', `${frontendUrl}/home?token=${token}`);
      res.redirect(`${frontendUrl}/home?token=${token}`);
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
