import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class MercadoPagoService {
    constructor(@Inject('MERCADOPAGO_CLIENT') private readonly mp: any) {}

    async createSubscription(plan: 'monthly' | 'annual', email: string) {
        const subscriptionData = {
        reason: plan === 'monthly' ? 'Suscripción Mensual' : 'Suscripción Anual',
        auto_recurring: {
            frequency: 1,
            frequency_type: plan === 'monthly' ? 'months' : 'years',
            transaction_amount: plan === 'monthly' ? 10 : 100, // 💲 precios
            currency_id: 'ARS',
            start_date: new Date().toISOString(),
            end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        },
        back_url: 'https://tu-frontend.com/success',
        payer_email: email,
        };

        try {
        const result = await this.mp.preapproval.create(subscriptionData);
        return result.response;
        } catch (err) {
        console.error('Error creando suscripción:', err);
        throw err;
        }
    }
}