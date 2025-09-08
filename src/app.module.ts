import { Module, OnModuleInit } from '@nestjs/common';
import { CategoryModule } from './categories/category.module';
import { PinModule } from './pins/pins.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { CategorySeeder } from './categories/category.seeder';

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
        password: configService.get("DB_PASSWORD"),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true
      })
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    CategoryModule,
    PinModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements OnModuleInit{
  
  constructor(private readonly category: CategorySeeder){}
  async onModuleInit() {
    await this.category.run()
  }
}
