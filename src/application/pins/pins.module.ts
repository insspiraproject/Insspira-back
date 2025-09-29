// src/pins/pins.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../entities/comments.entity';
import { Like } from '../../entities/likes.entity';
import { Pin } from '../../entities/pins.entity';

import { PinsService } from './pins.service';
import { PinsRepository } from '../../rest/repository/pins.repository';



import { View } from '../../entities/view.entity';
import { Save } from '../../entities/save.entity';
import { NotificationsModule } from 'src/application/notifications/notifications.module';
import { Sub } from 'src/entities/subscription.entity';
import { PinsGuardPage } from 'src/common/guards/guard.pin';
import { User } from 'src/entities/user.entity';
import { Category } from 'src/entities/category.entity';
import { Hashtag } from 'src/entities/hashtag.entity';
import { PinsController } from 'src/rest/controller/pins.controller';



@Module({
  imports: [TypeOrmModule.forFeature([Comment, Like, Pin, User, Category, Hashtag, View, Save, Sub]),
  NotificationsModule
],
  controllers: [PinsController],
  providers: [PinsService, PinsRepository, PinsGuardPage],
  exports:[PinsService]

})
export class PinModule {}
