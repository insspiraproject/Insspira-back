import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  Param,
  Get,
  Delete,
  Req,
  Res,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { MercadoPagoService } from './mercadopago.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../payments/payment.entity';
import { Repository } from 'typeorm';
import { ApiTags, ApiBody, ApiParam, ApiProperty, ApiOperation } from '@nestjs/swagger';

class CreateSubscriptionDto {
  @ApiProperty({ description: 'Email del usuario para la suscripción', example: 'usuario@mail.com' })
  email: string;

  @ApiProperty({ description: 'ID del usuario (opcional)', example: 'b7e5f1a2-4c8d-45f3-b9c9-8d1234567890', required: false })
  userId?: string;
}

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UsePipes(new ValidationPipe({ transform: true }))
export class MercadoPagoController {
  constructor(
    private readonly mpService: MercadoPagoService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>
  ) {}

  @Post('monthly')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiOperation({ summary: 'Crear suscripción mensual', description: 'Genera una preferencia de pago mensual para el usuario indicado.' })
  async createMonthly(@Body() body: CreateSubscriptionDto) {
    if (!body.email) return { success: false, message: 'Email es requerido' };
    try { return await this.mpService.createPreference('monthly', body.email, body.userId); }
    catch (error: any) { return { success: false, message: error.message }; }
  }

  @Post('annual')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiOperation({ summary: 'Crear suscripción anual', description: 'Genera una preferencia de pago anual para el usuario indicado.' })
  async createAnnual(@Body() body: CreateSubscriptionDto) {
    if (!body.email) return { success: false, message: 'Email es requerido' };
    try { return await this.mpService.createPreference('annual', body.email, body.userId); }
    catch (error: any) { return { success: false, message: error.message }; }
  }

  @Delete('cancel/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'userId', type: String, description: 'UUID del usuario para cancelar su pago', example: 'b7e5f1a2-4c8d-45f3-b9c9-8d1234567890' })
  @ApiOperation({ summary: 'Cancelar suscripción activa', description: 'Cancela el pago activo del usuario indicado, manteniendo acceso hasta el final del período.' })
  async cancelUserPayment(@Param('userId') userId: string) {
    try {
      const activePayment = await this.paymentRepository
        .createQueryBuilder('payment')
        .where('payment.userId = :userId AND payment.status = :status', { userId, status: 'active' })
        .orderBy('payment.createdAt', 'DESC')
        .getOne();

      if (!activePayment) return { success: false, message: 'No se encontró pago activo' };

      activePayment.status = 'cancelled';
      await this.paymentRepository.save(activePayment);

      return { success: true, message: 'Pago cancelado. Acceso hasta el final del período.', endsAt: activePayment.endsAt };
    } catch (error) {
      console.error('Error cancelando:', error);
      return { success: false, message: 'Error al cancelar' };
    }
  }

  @Get('status/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'userId', type: String, description: 'UUID del usuario para consultar estado de pagos', example: 'b7e5f1a2-4c8d-45f3-b9c9-8d1234567890' })
  @ApiOperation({ summary: 'Consultar estado de suscripción', description: 'Devuelve si el usuario tiene un pago activo y detalles del plan.' })
  async getPaymentStatus(@Param('userId') userId: string) {
    try {
      const payments = await this.paymentRepository
        .createQueryBuilder('payment')
        .where('payment.userId = :userId', { userId })
        .orderBy('payment.createdAt', 'DESC')
        .getOne();

      if (!payments) return { success: true, hasActivePayment: false };

      const hasActive = payments.status === 'active' && new Date() <= payments.endsAt;
      return { success: true, hasActivePayment: hasActive, plan: payments.plan, status: payments.status, endsAt: payments.endsAt };
    } catch (error) {
      console.error('Error obteniendo estado:', error);
      return { success: false, message: 'Error al obtener estado' };
    }
  }

  @Get('success')
  @ApiOperation({ summary: 'Confirmación de pago exitoso', description: 'Endpoint al que redirige MercadoPago después de un pago exitoso.' })
  async success(@Req() req: Request, @Res() res: Response) {
    const { preference_id, payment_id, external_reference } = req.query as any;
    if (external_reference && payment_id) {
      try {
        const [_, userId, plan] = external_reference.split('_');
        const startsAt = new Date();
        const endsAt = new Date(startsAt);
        if (plan === 'monthly') endsAt.setMonth(endsAt.getMonth() + 1);
        else endsAt.setFullYear(endsAt.getFullYear() + 1);

        await this.paymentRepository.save({ userId, paymentId: payment_id, plan, status: 'active', startsAt, endsAt });
        console.log(`✅ Payment creado: ${userId} - ${plan}`);
      } catch (error) { console.error('❌ Error guardando payment:', error); }
    }
    console.log('✅ Pago exitoso:', { preference_id, payment_id, external_reference });

    res.send(`
      <html><head><title>Pago Exitoso</title></head>
      <body>
        <div>✅ ¡Pago realizado con éxito!</div>
        <p><strong>Preference ID:</strong> ${preference_id || 'N/A'}</p>
        <p><strong>Payment ID:</strong> ${payment_id || 'N/A'}</p>
        <p><strong>Referencia:</strong> ${external_reference || 'N/A'}</p>
        <p><a href="/">← Volver al inicio</a></p>
      </body></html>
    `);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'UUID de la suscripción', example: 'a3e2d7d8-8c4c-4c9f-a123-9a1234567890' })
  @ApiOperation({ summary: 'Obtener suscripción por ID', description: 'Devuelve los detalles de la suscripción indicada por ID.' })
  async getSubscription(@Param('id') id: string) {
    try { return await this.mpService.getSubscription(id); }
    catch (error: any) { return { success: false, message: error.message }; }
  }

  @Get('failure')
  @ApiOperation({ summary: 'Pago fallido', description: 'Endpoint al que redirige MercadoPago cuando un pago falla.' })
  async failure(@Req() req: Request, @Res() res: Response) {
    const { preference_id, payment_id } = req.query as any;
    console.log('❌ Pago fallido:', { preference_id, payment_id });

    res.send(`
      <html><head><title>Pago Fallido</title></head>
      <body>
        <div>❌ El pago no se pudo procesar</div>
        <p><strong>Preference ID:</strong> ${preference_id || 'N/A'}</p>
        <p><strong>Payment ID:</strong> ${payment_id || 'N/A'}</p>
        <p><a href="/subscriptions/monthly">← Intentar nuevamente</a></p>
        <p><a href="/">← Volver al inicio</a></p>
      </body></html>
    `);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Pago pendiente', description: 'Endpoint al que redirige MercadoPago cuando un pago está pendiente de confirmación.' })
  async pending(@Req() req: Request, @Res() res: Response) {
    const { preference_id } = req.query as any;
    console.log('⏳ Pago pendiente:', { preference_id });

    res.send(`
      <html><head><title>Pago Pendiente</title></head>
      <body>
        <div>⏳ Tu pago está siendo procesado</div>
        <p><strong>Preference ID:</strong> ${preference_id || 'N/A'}</p>
        <p>En breve recibirás una confirmación por email</p>
        <p><a href="/">← Volver al inicio</a></p>
      </body></html>
    `);
  }
}
