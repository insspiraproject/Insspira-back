import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {NotificationsModule} from './notifications/notifications.module'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
