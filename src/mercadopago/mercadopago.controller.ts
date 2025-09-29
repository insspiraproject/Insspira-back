import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  Param,
  Get,
  Delete,
  ValidationPipe,
  UsePipes,
  Res,
  Req,
  UseGuards
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { MercadoPagoService } from './mercadopago.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../payments/payment.entity';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SubStatus } from 'src/status.enum';


class CreateSubscriptionDto {
  email: string;
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
  @ApiOperation({
    summary: 'Create a monthly subscription and initiate payment preference',
    description:
      'This endpoint creates a monthly subscription for a user and returns a MercadoPago preference object for payment. Email is required, userId is optional.',
  })
    async createMonthly(@Body() body: CreateSubscriptionDto) {
      if (!body.email) {
        return {
          success: false,
          message: 'Email es requerido',
        };
      }
      
      try {
        const result = await this.mpService.createPreference('monthly', body.email, body.userId);
        return result;
      } catch (error: any) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
  
    @Post('annual')
    @HttpCode(HttpStatus.CREATED)
    async createAnnual(@Body() body: CreateSubscriptionDto) {
      if (!body.email) {
        return {
          success: false,
          message: 'Email es requerido',
        };
      }
      
      try {
        const result = await this.mpService.createPreference('annual', body.email, body.userId);
        return result;
      } catch (error: any) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
  
    @Delete('cancel/:userId')
    @HttpCode(HttpStatus.OK)
    async cancelUserPayment(@Param('userId') userId: string) {
      try {
        const activePayment = await this.paymentRepository
          .createQueryBuilder('payment')
          .where('payment.userId = :userId AND payment.status = :status', {
            userId,
            status: 'active'
          })
          .orderBy('payment.createdAt', 'DESC')
          .getOne();

      if (!activePayment) {
        return { success: false, message: 'No active payment found' };
      }

        activePayment.status = SubStatus.CANCELLED;
        await this.paymentRepository.save(activePayment);

      return {
        success: true,
        message: 'Payment cancelled. Access valid until the end of the period.',
        endsAt: activePayment.endsAt,
      };
    } catch (error) {
      console.error('Error cancelling payment:', error);
      return { success: false, message: 'Error cancelling payment' };
    }
  }

  @Get('status/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve the current subscription status for a user',
    description:
      'Returns whether the user has an active subscription, along with plan details, status, USD price, and benefits. If no payment exists, returns default free plan.',
  })
  async getPaymentStatus(@Param('userId') userId: string) {
    try {
      const payment = await this.paymentRepository
        .createQueryBuilder('payment')
        .where('payment.userId = :userId', { userId })
        .orderBy('payment.createdAt', 'DESC')
        .getOne();

      if (!payment) {
        return {
          success: true,
          hasActivePayment: false,
          plan: 'free',
          usdPrice: 0,
          benefits: { name: 'Free Plan', features: ['10 pins/month', 'Basic search'] }
        };
      }

        const hasActive = payment.status === SubStatus.ACTIVE && new Date() <= payment.endsAt;
        
        return {
          success: true,
          hasActivePayment: hasActive,
          plan: payment.plan,
          status: payment.status,
          endsAt: payment.endsAt,
        };
      } catch (error) {
        console.error('Error obteniendo estado:', error);
        return {
          success: false,
          message: 'Error al obtener estado',
        };
      }
    }
  
    @Get('success')
    async success(@Req() req: Request, @Res() res: Response) {
      const { preference_id, payment_id, external_reference } = req.query as any;
      
      if (external_reference && payment_id) {
        try {
          const [_, userId, plan] = external_reference.split('_');
          const startsAt = new Date();
          const endsAt = new Date(startsAt);
          if (plan === 'monthly') {
            endsAt.setMonth(endsAt.getMonth() + 1);
          } else {
            endsAt.setFullYear(endsAt.getFullYear() + 1);
          }
          
          await this.paymentRepository.save({
            userId,
            paymentId: payment_id,
            plan,
            status: SubStatus.ACTIVE,
            startsAt: new Date(),
            endsAt,
          });
          
          console.log(`✅ Payment creado: ${userId} - ${plan}`);
        } catch (error) {
          console.error('❌ Error guardando payment:', error);
        }
      }

    console.log('✅ Successful payment:', { preference_id, payment_id, external_reference });
    res.send(`<html>...success page...</html>`);
  }

  @Get('failure')
  @ApiOperation({
    summary: 'Handle failed payment redirection from MercadoPago',
    description: 'Displays a failure page and logs the failed payment parameters.',
  })
  failure(@Req() req: Request, @Res() res: Response) {
    const { preference_id, payment_id } = req.query as any;
    console.log('❌ Failed payment:', { preference_id, payment_id });
    res.send(`<html>...failure page...</html>`);
  }

  @Get('pending')
  @ApiOperation({
    summary: 'Handle pending payment redirection from MercadoPago',
    description: 'Displays a pending payment page and logs the pending payment parameters.',
  })
  pending(@Req() req: Request, @Res() res: Response) {
    const { preference_id } = req.query as any;
    console.log('⏳ Pending payment:', { preference_id });
    res.send(`<html>...pending page...</html>`);
  }

  @Get('payment/:paymentId')
  @ApiOperation({
    summary: 'Retrieve payment details by MercadoPago payment ID',
    description: 'Fetches detailed information about a specific payment using the MercadoPago service.',
  })
  async getPaymentDetails(@Param('paymentId') paymentId: string) {
    try {
      const result = await this.mpService.getPaymentDetails(paymentId);
      return result;
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  @Get('history/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve the full payment history for a user',
    description:
      'Returns a chronological history of all payments, including plan details, status, USD and ARS amounts, and aggregates like total payments and total spent.',
  })
  async getPaymentHistory(@Param('userId') userId: string) {
    try {
      const payments = await this.paymentRepository.find({ where: { user: {id: userId} }, order: { createdAt: 'DESC' } });

      if (payments.length === 0) return { success: true, history: [], stats: { totalPayments: 0, totalSpentUSD: 0, totalSpentARS: 0, activeSubscriptions: 0 } };

      const history = payments.map(payment => {
        const usdPrice = payment.billingCycle === 'monthly' ? 10 : 100;
        const statusLabel = payment.status === 'active' ? 'paid' : payment.status === 'cancelled' ? 'cancelled' : 'expired';
        return {
          id: payment.id,
          paymentId: payment.paymentId,
          date: payment.createdAt,
          plan: payment.plan,
          description: `${payment.billingCycle === 'monthly' ? 'Monthly' : 'Annual'} Premium (${usdPrice} USD)`,
          status: statusLabel,
          statusLabel: statusLabel === 'paid' ? 'Paid' : statusLabel === 'cancelled' ? 'Cancelled' : 'Expired',
          usdPrice,
          arsPrice: payment.amount,
          startsAt: payment.startsAt,
          endsAt: payment.endsAt,
          isActive: payment.status === 'active' && new Date() <= payment.endsAt
        };
      });

      const totalPayments = history.length;
      const totalSpentUSD = history.reduce((sum, payment) => sum + payment.usdPrice, 0);
      const totalSpentARS = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

      return { success: true, history, stats: { totalPayments, totalSpentUSD, totalSpentARS, activeSubscriptions: history.filter(p => p.isActive).length } };
    } catch (error) {
      console.error('Error getting payment history:', error);
      return { success: false, message: 'Error retrieving payment history' };
    }
  }
}
