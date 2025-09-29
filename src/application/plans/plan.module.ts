import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlansService } from './plan.service';
import { Plan } from '../../entities/plan.entity';
import { PlanSeeder } from '../../rest/types/plan.seeder';
import { PlansController } from 'src/rest/controller/plan.controller';



@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  controllers: [PlansController],
  providers: [PlansService, PlanSeeder],
  exports: [PlanSeeder]

})
export class PlanModule {}
