import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionService } from './subscription.service';
import { Sub } from '../../entities/subscription.entity';
import { SubscriptionController } from 'src/rest/controller/subscription.controller';



@Module({
  imports: [TypeOrmModule.forFeature([Sub])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
