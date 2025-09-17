import { Controller, Post, Body } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';

@Controller('subscriptions')
export class MercadoPagoController {
    constructor(private readonly mpService: MercadoPagoService) {}

    @Post('monthly')
    async createMonthly(@Body('email') email: string) {
        return this.mpService.createSubscription('monthly', email);
    }

    @Post('annual')
    async createAnnual(@Body('email') email: string) {
        return this.mpService.createSubscription('annual', email);
    }
}