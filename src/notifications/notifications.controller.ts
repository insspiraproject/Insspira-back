import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendEmailDto } from './dto/sendEmail.dto';
import { LikeNotificationDto, CommentNotificationDto } from './dto/createNotification.dto';
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar correo de bienvenida a un usuario' })
  @ApiBody({ type: SendEmailDto })
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
  @ApiOperation({ summary: 'Enviar notificación por like a un usuario' })
  @ApiBody({ type: LikeNotificationDto })
  async sendLikeNotification(@Body() body: LikeNotificationDto) {
    const result = await this.notificationsService.sendLike(body);

    if (!result.success) {
      throw new HttpException('Error enviando correo de like', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { success: true, message: 'Correo de like enviado' };
  }

  @Post('comment')
  @ApiOperation({ summary: 'Enviar notificación por comentario a un usuario' })
  @ApiBody({ type: CommentNotificationDto })
  async sendCommentNotification(@Body() body: CommentNotificationDto) {
    const result = await this.notificationsService.sendComment(body);

    if (!result.success) {
      throw new HttpException('Error enviando correo de comentario', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { success: true, message: 'Correo de comentario enviado' };
  }
}
