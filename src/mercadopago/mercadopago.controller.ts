import { 
    Controller, 
    Post, 
    Body, 
    HttpCode, 
    HttpStatus,
    Param,
    Get,
    Delete,
    Headers,
    ValidationPipe,
    UsePipes,
    Res,
    Req
  } from '@nestjs/common';
  import type { Response, Request } from 'express';  // ✅ CAMBIO AQUÍ: import type
  import { MercadoPagoService } from './mercadopago.service';
  
  class CreateSubscriptionDto {
    email: string;
    userId?: string;
  }
  
  @Controller('subscriptions')
  @UsePipes(new ValidationPipe({ transform: true }))
  export class MercadoPagoController {
    constructor(private readonly mpService: MercadoPagoService) {}
  
    @Post('monthly')
    @HttpCode(HttpStatus.CREATED)
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
  
    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handleWebhook(
      @Body() body: any,
      @Headers('x-signature') signature: string
    ) {
      try {
        const isVerified = this.mpService.verifyWebhook(body, signature);
        
        if (!isVerified) {
          return {
            success: false,
            message: 'Webhook no verificado',
          };
        }
  
        if (body.type === 'payment') {
          const paymentId = body.data.id;
          const payment = await this.mpService.getPayment(paymentId);
          
          console.log('💳 Pago recibido:', payment.data);
          
          return {
            success: true,
            message: 'Webhook procesado correctamente',
            paymentId: paymentId,
          };
        }
  
        return {
          success: true,
          message: 'Webhook recibido',
        };
      } catch (error: any) {
        console.error('Error procesando webhook:', error);
        return {
          success: false,
          message: 'Error procesando webhook',
        };
      }
    }
  
    
  
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async cancelSubscription(@Param('id') id: string) {
      try {
        const result = await this.mpService.cancelSubscription(id);
        return result;
      } catch (error: any) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
  
    // ✅ ENDPOINTS DE CALLBACK - CORREGIDOS
    @Get('success')
    success(@Req() req: Request, @Res() res: Response) {
      const { preference_id, payment_id, external_reference } = req.query as any;
      
      console.log('✅ Pago exitoso:', {
        preference_id,
        payment_id,
        external_reference
      });
  
      res.send(`
        <html>
          <head>
            <title>Pago Exitoso</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px; 
                background-color: #f5f5f5;
              }
              .success { 
                color: #28a745; 
                font-size: 24px; 
                margin-bottom: 20px;
              }
              .info { 
                background: white; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 10px auto; 
                max-width: 400px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              a { 
                color: #007bff; 
                text-decoration: none; 
                font-weight: bold;
              }
              a:hover { 
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="success">✅ ¡Pago realizado con éxito!</div>
            <div class="info">
              <h2>Detalles del pago:</h2>
              <p><strong>Preference ID:</strong> ${preference_id || 'N/A'}</p>
              <p><strong>Payment ID:</strong> ${payment_id || 'N/A'}</p>
              <p><strong>Referencia:</strong> ${external_reference || 'N/A'}</p>
              <p><a href="/">← Volver al inicio</a></p>
            </div>
          </body>
        </html>
      `);
    }

    @Get(':id')
    async getSubscription(@Param('id') id: string) {
      try {
        const result = await this.mpService.getSubscription(id);
        return result;
      } catch (error: any) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
  
    @Get('failure')
    failure(@Req() req: Request, @Res() res: Response) {
      const { preference_id, payment_id } = req.query as any;
      
      console.log('❌ Pago fallido:', {
        preference_id,
        payment_id
      });
  
      res.send(`
        <html>
          <head>
            <title>Pago Fallido</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px; 
                background-color: #f5f5f5;
              }
              .error { 
                color: #dc3545; 
                font-size: 24px; 
                margin-bottom: 20px;
              }
              .info { 
                background: white; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 10px auto; 
                max-width: 400px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              a { 
                color: #007bff; 
                text-decoration: none; 
                font-weight: bold;
              }
              a:hover { 
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="error">❌ El pago no se pudo procesar</div>
            <div class="info">
              <h2>Detalles del error:</h2>
              <p><strong>Preference ID:</strong> ${preference_id || 'N/A'}</p>
              <p><strong>Payment ID:</strong> ${payment_id || 'N/A'}</p>
              <p><a href="/subscriptions/monthly">← Intentar nuevamente</a></p>
              <p><a href="/">← Volver al inicio</a></p>
            </div>
          </body>
        </html>
      `);
    }
  
    @Get('pending')
    pending(@Req() req: Request, @Res() res: Response) {
      const { preference_id } = req.query as any;
      
      console.log('⏳ Pago pendiente:', {
        preference_id
      });
  
      res.send(`
        <html>
          <head>
            <title>Pago Pendiente</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px; 
                background-color: #f5f5f5;
              }
              .pending { 
                color: #ffc107; 
                font-size: 24px; 
                margin-bottom: 20px;
              }
              .info { 
                background: white; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 10px auto; 
                max-width: 400px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              a { 
                color: #007bff; 
                text-decoration: none; 
                font-weight: bold;
              }
              a:hover { 
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="pending">⏳ Tu pago está siendo procesado</div>
            <div class="info">
              <h2>Estado del pago:</h2>
              <p><strong>Preference ID:</strong> ${preference_id || 'N/A'}</p>
              <p>En breve recibirás una confirmación por email</p>
              <p><a href="/">← Volver al inicio</a></p>
            </div>
          </body>
        </html>
      `);
    }
  }