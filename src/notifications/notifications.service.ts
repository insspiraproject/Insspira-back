import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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

  async sendEmail(to: string, subject: string, message: string) {
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
}
