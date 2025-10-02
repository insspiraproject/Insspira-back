// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { Report } from '../reports/report.entity';
import { Payment } from '../payments/payment.entity';
import { Plan } from '../plans/plan.entity';
import { Sub } from '../subscriptions/subscription.entity';
import { User } from '../users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Sub, Plan, Payment, Report]),
    UsersModule,
    JwtModule.register({ secret: process.env.JWT_SECRET || 'default_jwt_secret' }),
    AuthModule,
    UsersModule
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
  exports: [AdminGuard],
})
export class AdminModule {}