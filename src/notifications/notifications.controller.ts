import { Controller,Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendEmailDto } from './dto/sendEmail.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
async notificationMail(@Body() body: SendEmailDto) {
  const { email, name } = body;

  const message = `
      Hola ${name} 👋

      ¡Bienvenido a Insspira! 🎨✨

        Somos una comunidad enfocada en la creatividad visual y las redes sociales con un fin recreativo.  
        Aquí podrás descubrir, guardar y compartir inspiración visual de todo tipo.  

        Además, ofrecemos un modelo de suscripción premium con beneficios exclusivos para potenciar tu experiencia. 🚀

      Gracias por unirte,  
      Al equipo de Insspira 💙
                  `;

  const result = await this.notificationsService.sendEmail(
    email,
    '✨ Bienvenido a Insspira ✨',
    message
  );

  return result;
}


}
