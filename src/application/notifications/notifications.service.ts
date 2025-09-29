// notifications/notifications.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateNotificationDto } from '../../rest/dto/createNotification.dto';
import { SendEmailDto } from '../../rest/dto/sendEmail.dto';

@Injectable()
export class NotificationsService {
  private transporter;
  private logger = new Logger(NotificationsService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });
  }

  private buildWelcomeMessage(dto: SendEmailDto) {
    const { name } = dto;
    return {
      subject: '✨ Bienvenido a Insspira ✨',
      message: `
      Hola ${name} 👋

      ¡Bienvenido a Insspira! 🎨✨

      Somos una comunidad enfocada en la creatividad visual y las redes sociales con un fin recreativo.  
      Aquí podrás descubrir, guardar y compartir inspiración visual de todo tipo.  

      Además, ofrecemos un modelo de suscripción premium con beneficios exclusivos para potenciar tu experiencia. 🚀

      Gracias por unirte,  
      Al equipo de Insspira 💙
      `,
    };
  }

  
  private buildActivityMessage(dto: CreateNotificationDto) {
    const { type, photoTitle, comment } = dto;

    if (type === 'like') {
      return {
        subject: `🎉 Tu foto "${photoTitle}" recibió un like!`,
        message: `¡Alguien le dio like a tu foto "${photoTitle}" en Insspira! 💙`,
      };
    } else if (type === 'comment') {
      return {
        subject: `💬 Nuevo comentario en tu foto "${photoTitle}"`,
        message: `Alguien comentó en tu foto "${photoTitle}":\n\n"${comment}"`,
      };
    } else {
      throw new BadRequestException('Tipo de notificación inválido');
    }
  }

  public async sendEmail(to: string, subject: string, message: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Insspira" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: message,
      });

      this.logger.log(`Correo enviado: ${info.messageId} a ${to}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error enviando correo a ${to}: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }

  async sendWelcome(dto: SendEmailDto) {
    const { subject, message } = this.buildWelcomeMessage(dto);
    return this.sendEmail(dto.email, subject, message);
  }

  async sendActivity(dto: CreateNotificationDto) {
    const { subject, message } = this.buildActivityMessage(dto);
    return this.sendEmail(dto.recipientEmail, subject, message);
  }
}
