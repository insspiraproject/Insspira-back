// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { Report } from 'src/reports/report.entity';
import { Payment } from 'src/payments/payment.entity';
import { Plan } from 'src/plans/plan.entity';
import { Sub } from 'src/subscriptions/subscription.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Sub, Plan, Payment, Report]),
    UsersModule,
    JwtModule.register({ secret: process.env.JWT_SECRET || 'default_jwt_secret' }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}