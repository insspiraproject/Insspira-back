import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categori } from './categorie.entity';
import { CategoriController } from './categorie.controller';
import { CategoriRepository } from './categorie.repository';
import { CategoriService } from './categorie.service';


@Module({
  imports: [TypeOrmModule.forFeature([Categori])],
  controllers: [CategoriController],
  providers: [CategoriRepository, CategoriService],
})
export class CategoriModule {}
