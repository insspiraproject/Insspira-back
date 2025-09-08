import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comments.entity';
import { Like } from './entities/likes.entity';
import { Pin } from './entities/pins.entity';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';
import { PinsRepository } from './pins.repository';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/category.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Comment, Like, Pin, User,Category])],
  controllers: [PinsController],
  providers: [PinsService, PinsRepository],
})
export class PinModule {}
