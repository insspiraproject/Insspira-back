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
  Req
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { MercadoPagoService } from './mercadopago.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../payments/payment.entity';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { SubStatus } from 'src/status.enum';
import { User } from '../users/entities/user.entity';
import { Plan } from '../plans/plan.entity';

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
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  @Post('monthly')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiOperation({
    summary: 'Create a monthly subscription',
    description:
      'Creates a monthly subscription for a user and generates a MercadoPago payment preference. Requires an email, userId is optional.',
  })
  async createMonthly(@Body() body: CreateSubscriptionDto) {
    if (!body.email) {
      return { success: false, message: 'Email es requerido' };
    }
    try {
      const result = await this.mpService.createPreference('monthly', body.email, body.userId);
      return result;
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  @Post('annual')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiOperation({
    summary: 'Create an annual subscription',
    description:
      'Creates an annual subscription for a user and generates a MercadoPago payment preference. Requires an email, userId is optional.',
  })
  async createAnnual(@Body() body: CreateSubscriptionDto) {
    if (!body.email) {
      return { success: false, message: 'Email es requerido' };
    }
    try {
      const result = await this.mpService.createPreference('annual', body.email, body.userId);
      return result;
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  @Delete('cancel/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel an active subscription for a user',
    description:
      'Cancels the most recent active subscription of a given user. The subscription remains valid until its expiration date.',
  })
  async cancelUserPayment(@Param('userId') userId: string) {
    try {
      const activePayment = await this.paymentRepository
        .createQueryBuilder('payment')
        .where('payment.userId = :userId AND payment.status = :status', {
          userId,
          status: 'active',
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
    summary: 'Retrieve subscription status',
    description:
      'Returns whether the user has an active subscription, along with plan details, status, and expiration. If no payment exists, defaults to the free plan.',
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
          benefits: { name: 'Free Plan', features: ['10 pins/month', 'Basic search'] },
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
      return { success: false, message: 'Error al obtener estado' };
    }
  }

  @Get('success')
  @ApiOperation({
    summary: 'Handle successful payment redirection from MercadoPago',
    description:
      'Redirects the user after a successful MercadoPago payment and logs relevant transaction data.',
  })
  async success(@Req() req: Request, @Res() res: Response) {
    const { preference_id, payment_id, external_reference } = req.query as any;
    console.log('✅ Successful payment redirect:', { preference_id, payment_id, external_reference });
    if (external_reference && payment_id) {
      const [_, userId, planType] = external_reference.split('_');
      console.log(`🔔 Pago exitoso de usuario ${userId} para plan ${planType}, paymentId: ${payment_id}`);
    }
    return res.redirect('https://insspira-front-git-vercel-insspiras-projects-818b6651.vercel.app/home');
  }

  @Get('failure')
  @ApiOperation({
    summary: 'Handle failed payment redirection',
    description:
      'Displays a failure page when a payment attempt fails. Logs failure details for monitoring.',
  })
  failure(@Req() req: Request, @Res() res: Response) {
    const { preference_id, payment_id } = req.query as any;
    console.log('❌ Failed payment:', { preference_id, payment_id });
    res.send(`<html>...failure page...</html>`);
  }

  @Get('pending')
  @ApiOperation({
    summary: 'Handle pending payment redirection',
    description:
      'Displays a pending page while the payment is still being processed. Logs relevant payment parameters.',
  })
  pending(@Req() req: Request, @Res() res: Response) {
    const { preference_id } = req.query as any;
    console.log('⏳ Pending payment:', { preference_id });
    res.send(`<html>...pending page...</html>`);
  }

  @Get('payment/:paymentId')
  @ApiOperation({
    summary: 'Get payment details by ID',
    description: 'Fetches detailed information about a payment using its MercadoPago ID.',
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
    summary: 'Retrieve full payment history for a user',
    description:
      'Returns the complete history of payments for a given user, including plan details, status, amounts in USD/ARS, and aggregated statistics.',
  })
  async getPaymentHistory(@Param('userId') userId: string) {
    try {
      const payments = await this.paymentRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });

      if (payments.length === 0)
        return {
          success: true,
          history: [],
          stats: { totalPayments: 0, totalSpentUSD: 0, totalSpentARS: 0, activeSubscriptions: 0 },
        };

      const history = payments.map((payment) => {
        const usdPrice = payment.billingCycle === 'monthly' ? 10 : 100;
        const statusLabel =
          payment.status === 'active'
            ? 'paid'
            : payment.status === 'cancelled'
            ? 'cancelled'
            : 'expired';
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
          isActive: payment.status === 'active' && new Date() <= payment.endsAt,
        };
      });

      const totalPayments = history.length;
      const totalSpentUSD = history.reduce((sum, payment) => sum + payment.usdPrice, 0);
      const totalSpentARS = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

      return {
        success: true,
        history,
        stats: {
          totalPayments,
          totalSpentUSD,
          totalSpentARS,
          activeSubscriptions: history.filter((p) => p.isActive).length,
        },
      };
    } catch (error) {
      console.error('Error getting payment history:', error);
      return { success: false, message: 'Error retrieving payment history' };
    }
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Process MercadoPago webhooks',
    description:
      'Handles webhook events sent by MercadoPago (e.g., payment approval, pending, cancellation) and updates the database accordingly.',
  })
  async webhook(@Req() req: Request, @Res() res: Response) {
    try {
      const { type, data } = req.body;
      console.log('🔔 Webhook recibido:', type, data);

      if (type === 'payment') {
        const paymentId = data.id;
        const paymentDetails = await this.mpService.getPaymentDetails(paymentId);
        const mpData = paymentDetails.data;

        const externalRef = mpData.external_reference;
        if (!externalRef) {
          console.error('❌ external_reference vacío');
          return res.status(400).send('external_reference inválido');
        }

        const parts = externalRef.split('_');
        const userId = parts[1];
        const planType = parts[2];

        const startsAt = new Date();
        const endsAt = new Date(startsAt);

        let billingCycle: 'monthly' | 'annual' = 'monthly';
        if (planType === 'monthly') endsAt.setMonth(endsAt.getMonth() + 1);
        else if (planType === 'annual') {
          endsAt.setFullYear(endsAt.getFullYear() + 1);
          billingCycle = 'annual';
        }

        const amount = Number(
          mpData.transaction_amount || mpData.transaction_details?.total_paid_amount || 0,
        );

        let status: SubStatus;
        switch (mpData.status) {
          case 'approved':
          case 'active':
            status = SubStatus.ACTIVE;
            break;
          case 'pending':
          case 'in_process':
            status = SubStatus.PENDING;
            break;
          default:
            status = SubStatus.CANCELLED;
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        const planEntity = await this.planRepository.findOne({ where: { type: planType } });

        if (!user || !planEntity) {
          console.error('Usuario o plan no encontrado');
          return res.status(400).send('Usuario o plan inválido');
        }

        await this.paymentRepository.save({
          user,
          plan: planEntity,
          paymentId,
          status,
          startsAt,
          endsAt,
          amount,
          billingCycle,
        });

        console.log(`✅ Pago registrado desde webhook: ${paymentId} (${status})`);
      }

      res.send('ok');
    } catch (error) {
      console.error('❌ Error procesando webhook:', error);
      res.status(500).send('error');
    }
  }
}
