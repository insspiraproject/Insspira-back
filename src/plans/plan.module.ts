import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';
import { Plan } from './plan.entity';
import { PlanSeeder } from './plan.seeder';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AdminGuard } from '../admin/admin.guard';



@Module({
  imports: [TypeOrmModule.forFeature([Plan]),
  AuthModule,
  UsersModule
],
  controllers: [PlansController],
  providers: [PlansService, PlanSeeder, AdminGuard],
  exports: [PlanSeeder]

})
export class PlanModule {}
