import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';
import { Plan } from './plan.entity';
import { PlanSeeder } from './plan.seeder';
import { AdminGuard } from 'src/admin/admin.guard';
import { AuthModule } from 'src/auth/auth.module';
import { AdminModule } from 'src/admin/admin.module';



@Module({
  imports: [TypeOrmModule.forFeature([Plan]), AuthModule],
  controllers: [PlansController],
  providers: [PlansService, PlanSeeder, AdminGuard],
  exports: [PlanSeeder]

})
export class PlanModule {}
