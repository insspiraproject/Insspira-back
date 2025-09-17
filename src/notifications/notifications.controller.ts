import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendEmailDto } from './dto/sendEmail.dto';
import { LikeNotificationDto, CommentNotificationDto } from './dto/createNotification.dto';

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

  @Post('like')
  async sendLikeNotification(@Body() body: LikeNotificationDto) {
    const result = await this.notificationsService.sendLike(body);

    if (!result.success) {
      throw new HttpException('Error enviando correo de like', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { success: true, message: 'Correo de like enviado' };
  }

  @Post('comment')
  async sendCommentNotification(@Body() body: CommentNotificationDto) {
    const result = await this.notificationsService.sendComment(body);

    if (!result.success) {
      throw new HttpException('Error enviando correo de comentario', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { success: true, message: 'Correo de comentario enviado' };
  }
}
