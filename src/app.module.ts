import { Module } from '@nestjs/common';
import { CategoriModule } from './categories/categorie.module';
import { PinModule } from './pins/pins.module';


@Module({
  imports: [CategoriModule, PinModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
