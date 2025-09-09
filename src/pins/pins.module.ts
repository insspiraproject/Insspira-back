import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entitys/comments.entity';
import { Like } from './entitys/likes.entity';
import { Pin } from './entitys/pins.entity';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';
import { PinsRepository } from './pins.repository';
import { User } from 'src/users/entities/user.entity';
import { Categorie } from 'src/categories/categorie.entity';
import { Hashtag } from './entitys/hashtag.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Comment, Like, Pin, User, Categorie, Hashtag])],
  controllers: [PinsController],
  providers: [PinsService, PinsRepository],
})
export class PinModule {}
