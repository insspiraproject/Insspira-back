import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';

import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../rest/types/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalJwtStrategy } from '../../rest/types/local-jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sub } from 'src/entities/subscription.entity';
import { Plan } from 'src/entities/plan.entity';
import { NotificationsModule } from 'src/application/notifications/notifications.module';
import { AuthController } from 'src/rest/controller/auth.controller';


@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: () => ({
            secret: process.env.JWT_SECRET || 'default_jwt_secret',
            signOptions: { expiresIn: '60m' },
            }),
        }),
        TypeOrmModule.forFeature([Sub, Plan]),
        NotificationsModule, 
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalJwtStrategy],
    exports: [AuthService],
  })
  export class AuthModule {}
