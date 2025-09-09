import { Module, OnModuleInit } from '@nestjs/common';
import { CategoriModule } from './categories/categorie.module';
import { PinModule } from './pins/pins.module';

import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoriSeeder } from './categories/categorie.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env.development'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        database: configService.get("DB_NAME"),
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD") as string,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true
      })
    }),
    UsersModule,
    CategoriModule, PinModule,
    AuthModule,
   
  ],
  controllers: [],
  providers: [],

})
export class AppModule implements OnModuleInit{
  
  constructor(private readonly categori: CategoriSeeder){}
  async onModuleInit() {
   await this.categori.run()
  }
}
