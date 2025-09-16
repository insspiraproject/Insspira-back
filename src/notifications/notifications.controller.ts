// notifications/notifications.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendEmailDto } from './dto/sendEmail.dto';
import { CreateNotificationDto } from './dto/createNotification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async notificationMail(@Body() body: SendEmailDto) {
    const result = await this.notificationsService.sendWelcome(body);

    if (!result.success) {
      throw new HttpException(
        'Error enviando el correo de bienvenida',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { success: true, message: 'Correo de bienvenida enviado' };
  }

  @Post('activity')
  async sendActivityNotification(@Body() body: CreateNotificationDto) {
    const result = await this.notificationsService.sendActivity(body);

    if (!result.success) {
      throw new HttpException(
        `Error enviando la notificación: ${result.error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { success: true, message: 'Notificación enviada' };
  }
}
