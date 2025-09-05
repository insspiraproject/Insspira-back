import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categori } from './categorie.entity';
import { CategoriController } from './categorie.controller';
import { CategoriRepository } from './categorie.repository';
import { CategoriService } from './categorie.service';
import { CategoriSeeder } from './categorie.seeder';


@Module({
  imports: [TypeOrmModule.forFeature([Categori])],
  controllers: [CategoriController],
  providers: [CategoriRepository, CategoriService, CategoriSeeder],
  exports:[CategoriSeeder]
})
export class CategoriModule {}
