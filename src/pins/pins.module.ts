import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entitys/comments.entity';
import { Like } from './entitys/likes.entity';
import { Pin } from './entitys/pins.entity';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';
import { PinsRepository } from './pins.repository';


@Module({
  imports: [TypeOrmModule.forFeature([Comment, Like, Pin])],
  controllers: [PinsController],
  providers: [PinsService, PinsRepository],
})
export class PinModule {}
