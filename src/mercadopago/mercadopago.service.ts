import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import * as crypto from 'crypto';

@Injectable()
export class MercadoPagoService {
    private readonly logger = new Logger(MercadoPagoService.name);
    private webhookSecret: string;
    private client: MercadoPagoConfig;

    constructor(private config: ConfigService) {
        const accessToken = this.config.get<string>('MP_ACCESS_TOKEN') || '';
        this.webhookSecret = this.config.get<string>('MP_WEBHOOK_SECRET') || '';
        this.client = new MercadoPagoConfig({ accessToken });
        this.logger.log('MercadoPago configured');
    }

    async createPreference(items: any[], payer?: any, external_reference?: string) {
        const appUrl = this.config.get<string>('APP_URL') || 'http://localhost:3000'; // Valor por defecto
        const preference = {
        items,
        payer,
        external_reference,
        back_urls: {
            success: `${appUrl}/api/payments/feedback?status=success`,
            pending: `${appUrl}/api/payments/feedback?status=pending`,
            failure: `${appUrl}/api/payments/feedback?status=failure`,
        },
        notification_url: `${appUrl}/api/payments/webhook`,
        };

        const prefClient = new Preference(this.client);
        const response = await prefClient.create({ body: preference });
        return response;
    }

    async getPayment(paymentId: string) {
        const paymentClient = new Payment(this.client);
        const response = await paymentClient.get({ id: paymentId });
        return response;
    }

    verifyXSignature(xSignature: string | undefined, xRequestId: string | undefined, dataId: string | undefined) {
        if (!xSignature || !xRequestId || !dataId || !this.webhookSecret) return false;

        const parts = xSignature.split(',');
        let ts = '';
        let v1 = '';
        for (const part of parts) {
        const [k, v] = part.split('=').map(s => s.trim());
        if (k === 'ts') ts = v;
        if (k === 'v1') v1 = v;
        }
        if (!ts || !v1) return false;

        const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
        const digest = crypto.createHmac('sha256', this.webhookSecret).update(manifest).digest('hex');

        try {
        return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(v1));
        } catch (e) {
        return false;
        }
    }
}