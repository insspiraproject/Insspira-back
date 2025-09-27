import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const mercadopago = require('mercadopago');
import axios from "axios";

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private readonly client: any;

  private readonly usdPrices = {
    monthly: 10.00,
    annual: 100.00
  };

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>('MP_ACCESS_TOKEN');
    
    if (!accessToken) {
      throw new Error('MP_ACCESS_TOKEN no está configurado');
    }

    mercadopago.configure({
      access_token: accessToken
    });
    
    this.client = mercadopago;
  }

  async getDolarBlueRate(): Promise<number> {
    try {
      const response = await axios.get('https://dolarapi.com/v1/dolares/blue');
      const rate = response.data.venta;
      this.logger.log(`Tasa dólar blue actual: ${rate} ARS/USD`);
      return rate;
    } catch (error) {
      this.logger.warn('Error obteniendo dólar blue, usando fallback: 1000');
      return 1000;
    }
  }

  async createPreference(plan: 'monthly' | 'annual', email: string, userId?: string): Promise<any> {
    const usdPrice = this.usdPrices[plan];
    
    const arsRate = await this.getDolarBlueRate();
    const arsPrice = usdPrice * arsRate;

    const preferenceData: any = {
      items: [{
        title: `${plan === 'monthly' ? 'Suscripción Mensual' : 'Suscripción Anual'} (${usdPrice} USD)`,
        unit_price: arsPrice,
        quantity: 1,
        currency_id: 'ARS',
      }],
      payer: {
        email: email,
      },
      back_urls: {
        success: process.env.BACK_URL_SUCCESS || 'http://localhost:3000/success',
        failure: process.env.BACK_URL_FAILURE || 'http://localhost:3000/failure',
        pending: process.env.BACK_URL_PENDING || 'http://localhost:3000/pending',
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 1,
      },
    };

    if (userId) {
      preferenceData.external_reference = `user_${userId}_${plan}`;
    }

    try {
      this.logger.log(`Creando preferencia ${plan}: ${usdPrice} USD * ${arsRate} = ${arsPrice} ARS`);
      
      const result = await this.client.preferences.create(preferenceData);

      return {
        success: true,
        id: result.body.id,
        init_point: result.body.init_point,
        sandbox_init_point: result.body.sandbox_init_point,
        usdPrice,
        arsPrice,
        arsRate,
        ...result.body,
      };
    } catch (error: any) {
      this.logger.error('Error creando preferencia:', error);
      throw new Error(`Error creando preferencia: ${error.message}`);
    }
  }

  async getPreference(preferenceId: string): Promise<any> {
    try {
      this.logger.log(`Obteniendo preferencia ${preferenceId}`);
      
      const result = await this.client.preferences.findById(preferenceId);
      
      return {
        success: true,
        data: result.body,
      };
    } catch (error: any) {
      this.logger.error('Error obteniendo preferencia:', error);
      throw new Error(`Error obteniendo preferencia: ${error.message}`);
    }
  }

  async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      this.logger.log(`Obteniendo pago ${paymentId}`);
      
      const result = await this.client.payment.findById(paymentId);
      
      return {
        success: true,
        data: result.body,
      };
    } catch (error: any) {
      this.logger.error('Error obteniendo pago:', error);
      throw new Error(`Error obteniendo pago: ${error.message}`);
    }
  }

  async createSubscription(plan: 'monthly' | 'annual', email: string, userId?: string): Promise<any> {
    const subscriptionData: any = {
      reason: plan === 'monthly' ? 'Suscripción Mensual' : 'Suscripción Anual',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: plan === 'monthly' ? 10 : 100,
        currency_id: 'ARS',
      },
      payer_email: email,
      back_url: process.env.BACK_URL_SUCCESS || 'http://localhost:3000/success',
    };

    if (userId) {
      subscriptionData.external_reference = `user_${userId}_${plan}`;
    }

    try {
      this.logger.log(`Creando suscripción ${plan} para ${email}`);
      
      const result = await this.client.subscription.create(subscriptionData);

      this.logger.log(`Suscripción creada: ${result.body.id}`);
      
      return {
        success: true,
        id: result.body.id,
        init_point: result.body.init_point,
        status: result.body.status,
        ...result.body,
      };
    } catch (error: any) {
      this.logger.error('Error creando suscripción:', error);
      throw new Error(`Error creando suscripción: ${error.message}`);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<any> {
    try {
      this.logger.log(`Cancelando suscripción ${subscriptionId}`);
      
      const result = await this.client.subscription.cancel(subscriptionId);
      
      return {
        success: true,
        data: result.body,
        message: 'Suscripción cancelada exitosamente',
      };
    } catch (error: any) {
      this.logger.error('Error cancelando suscripción:', error);
      throw new Error(`Error cancelando suscripción: ${error.message}`);
    }
  }

  async getAllSubscriptions(): Promise<any> {
    try {
      this.logger.log('Obteniendo todas las suscripciones');
      
      const result = await this.client.subscription.findAll();
      
      return {
        success: true,
        data: result.body,
      };
    } catch (error: any) {
      this.logger.error('Error obteniendo suscripciones:', error);
      throw new Error(`Error obteniendo suscripciones: ${error.message}`);
    }
  }
}