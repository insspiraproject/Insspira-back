import { Module, OnModuleInit } from '@nestjs/common';
import { CategoryModule } from "./application/categories/category.module";
import { PinModule } from './application/pins/pins.module';
import { UsersModule } from './application/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './application/auth/auth.module';
import { FilesModule } from './application/files/files.module';
import { CategorySeeder } from './rest/types/category.seeder';
import { MercadoPagoModule } from './application/mercadopago/mercadopago.module';
import { PlanModule } from './application/plans/plan.module';
import { NotificationsModule } from './application/notifications/notifications.module';
import { MercadoPagoController } from './rest/controller/mercadopago.controller';
import { Payment } from './entities/payment.entity';
import { SubscriptionModule } from './application/subscriptions/subscription.module';
import { ReportModule } from './application/reports/report.module';
import { PlanSeeder } from './rest/types/plan.seeder';
import { AppController, AuthController } from './rest/controller/auth.controller';

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
