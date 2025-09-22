import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalJwtStrategy } from './local-jwt.strategy';
import session from 'express-session';

@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
        useFactory: () => ({
            secret: process.env.JWT_SECRET || 'your_jwt_secret',
            signOptions: { expiresIn: '60m' },
        }),
        }),        
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalJwtStrategy ],
    exports: [AuthService],
})
export class AuthModule implements NestModule { // ← IMPORTANTE: implements NestModule
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                session({
                    secret: process.env.SESSION_SECRET || 'your_session_secret',
                    resave: false,
                    saveUninitialized: false,
                    cookie: { 
                        secure: false, // true en producción con HTTPS
                        maxAge: 24 * 60 * 60 * 1000 // 24 horas
                    },
                }),
            )
            .forRoutes('*');
    }
}

