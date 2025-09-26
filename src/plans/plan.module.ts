import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';
import { Plan } from './plan.entity';
import { PlanSeeder } from './plan.seeder';



@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  controllers: [PlansController],
  providers: [PlansService, PlanSeeder],
  exports: [PlanSeeder]

})
export class PlanModule {}
