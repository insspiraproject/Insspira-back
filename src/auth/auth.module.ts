import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleOidcStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalJwtStrategy } from './local-jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sub } from 'src/subscriptions/subscription.entity';
import { Plan } from 'src/plans/plan.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { User } from 'src/users/entities/user.entity';



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
        TypeOrmModule.forFeature([Sub, Plan, User]),
        NotificationsModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalJwtStrategy, GoogleOidcStrategy],
    exports: [AuthService],
  })
  export class AuthModule {}
