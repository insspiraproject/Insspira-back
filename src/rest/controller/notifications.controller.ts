import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { NotificationsService } from 'src/application/notifications/notifications.service';
import { SendEmailDto } from '../dto/sendEmail.dto';
import { CreateNotificationDto } from '../dto/createNotification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiBody({ type: SendEmailDto })
  @ApiOperation({
    summary: 'Send a welcome email to a user',
    description:
      'This endpoint sends a welcome email to a user using the information provided in the SendEmailDto. It returns success if the email was delivered successfully, otherwise it throws an error.',
  })
  async notificationMail(@Body() body: SendEmailDto) {
    const result = await this.notificationsService.sendWelcome(body);

    if (!result.success) {
      throw new HttpException(
        'Error sending the welcome email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { success: true, message: 'Welcome email sent successfully' };
  }

  @Post('activity')
  @ApiBody({ type: CreateNotificationDto })
  @ApiOperation({
    summary: 'Send a user activity notification',
    description:
      'This endpoint sends an activity notification based on the data in CreateNotificationDto. It returns a success message if the notification was sent successfully, otherwise it throws an error with details.',
  })
  async sendActivityNotification(@Body() body: CreateNotificationDto) {
    const result = await this.notificationsService.sendActivity(body);

    if (!result.success) {
      throw new HttpException(
        `Error sending notification: ${result.error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { success: true, message: 'Notification sent successfully' };
  }
}
