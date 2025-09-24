import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Plan } from 'src/plans/plan.entity';
import { User } from 'src/users/entities/user.entity';
import { Sub } from './subscription.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Plan, User, Sub,])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
