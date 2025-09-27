import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalJwtStrategy } from './local-jwt.strategy';
import { NotificationsModule } from 'src/notifications/notifications.module';

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
        NotificationsModule      
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalJwtStrategy ],
    exports: [AuthService],
})
export class AuthModule {}

