// src/pins/pins.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comments.entity';
import { Like } from './entities/likes.entity';
import { Pin } from './entities/pins.entity';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';
import { PinsRepository } from './pins.repository';
import { User } from 'src/users/entities/user.entity';
import { Category } from '../categories/category.entity';
import { Hashtag } from './entities/hashtag.entity';
import { View } from './entities/view.entity';
import { Save } from './entities/save.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Sub } from 'src/subscriptions/subscription.entity';
import { PinsGuardPage } from 'src/common/guards/guard.pin';



@Module({
  imports: [TypeOrmModule.forFeature([Comment, Like, Pin, User, Category, Hashtag, View, Save, Sub]),
  NotificationsModule
],
  controllers: [PinsController],
  providers: [PinsService, PinsRepository, PinsGuardPage],
  exports:[PinsService]

})
export class PinModule {}
