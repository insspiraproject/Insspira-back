// src/users/users.module.ts  
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from '../../rest/controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PinModule } from '../pins/pins.module';
import { User } from 'src/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PinModule
  ],
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService],
  exports: [UsersService],
})
export class UsersModule {}
