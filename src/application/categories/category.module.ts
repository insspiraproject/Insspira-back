import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryRepository } from '../../rest/repository/category.repository';
import { CategoryService } from './category.service';
import { CategorySeeder } from '../../rest/types/category.seeder';
import { Category } from 'src/entities/category.entity';
import { CategoryController } from 'src/rest/controller/category.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryRepository, CategoryService, CategorySeeder],
  exports:[CategorySeeder]
})
export class CategoryModule {}
