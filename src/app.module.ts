import { Module, OnModuleInit } from '@nestjs/common';
import { CategoryModule } from "./categories/category.module";
import { PinModule } from './pins/pins.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { CategorySeeder } from './categories/category.seeder';
import { AppController, AuthController } from './auth/auth.controller';
import { MercadoPagoModule } from './mercadopago/mercadopago.module';
import { PlanModule } from './plans/plan.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MercadoPagoController } from './mercadopago/mercadopago.controller';
import { Payment } from './payments/payment.entity';
import { SubscriptionModule } from './subscriptions/subscription.module';
import { ReportModule } from './reports/report.module';
import { PlanSeeder } from './plans/plan.seeder';

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
        entities: [__dirname + '/**/*.entity{.ts,.js}', Payment],
        synchronize: true
      })
    }),
    TypeOrmModule.forFeature([Payment]),
    UsersModule,
    AuthModule,
    FilesModule,
    CategoryModule,
    PinModule,
    MercadoPagoModule,
    PlanModule,
    NotificationsModule,
    SubscriptionModule,
    ReportModule
  ],
  controllers: [AppController, AuthController, MercadoPagoController],
  providers: [],
})

export class AppModule implements OnModuleInit{

  constructor(
    private readonly plan: PlanSeeder,
    private readonly category: CategorySeeder
  ){}
  async onModuleInit() {
    await this.category.run()
    await this.plan.run()
  }

}
