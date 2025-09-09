import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categorie } from './categorie.entity';
import { CategorieController } from './categorie.controller';
import { CategorieRepository } from './categorie.repository';
import { CategorieService } from './categorie.service';
import { CategoriSeeder } from './categorie.seeder';


@Module({
  imports: [TypeOrmModule.forFeature([Categorie])],
  controllers: [CategorieController],
  providers: [CategorieRepository, CategorieService, CategoriSeeder],
  exports:[CategoriSeeder]
})
export class CategoriModule {}
