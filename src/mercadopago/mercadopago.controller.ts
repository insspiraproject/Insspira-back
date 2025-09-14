import { Controller, Post, Body, Req, Res, Get, Logger } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import type { Request, Response } from 'express';

@Controller('api/payments')
export class MercadoPagoController {
    private readonly logger = new Logger(MercadoPagoController.name);
    constructor(private readonly mpService: MercadoPagoService) {}

    @Post('create')
    async create(@Body() body: any, @Res() res: Response) {
        try {
    
        const { items, payer, external_reference } = body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'items required' });
        }
        const pref = await this.mpService.createPreference(items, payer, external_reference);
        return res.json({
            id: pref.id,
            init_point: pref.init_point, 
            sandbox_init_point: pref.sandbox_init_point, 
        });
        } catch (err) {
        this.logger.error(err);
        return res.status(500).json({ message: 'error creating preference', error: err.message });
        }
    }

    @Post('webhook')
    async webhook(@Req() req: Request, @Res() res: Response) {
        // tomar id desde query o body:
        const dataId = (req.query.id as string) || (req.query['data.id'] as string) || (req.body && req.body.data && req.body.data.id);
        const xSignature = req.headers['x-signature'] as string | undefined;
        const xRequestId = req.headers['x-request-id'] as string | undefined;

        const ok = this.mpService.verifyXSignature(xSignature, xRequestId, dataId);
        if (!ok) {
        this.logger.warn('Invalid webhook signature', { xSignature, xRequestId, dataId });
        return res.status(401).send('invalid signature');
        }

        try {
    
        if (dataId) {
            const payment = await this.mpService.getPayment(dataId);
            this.logger.log('Webhook payment data', JSON.stringify(payment));
        }
        return res.status(200).send('ok');
        } catch (e) {
        this.logger.error('error processing webhook', e);
        return res.status(500).send('error');
        }
    }

    @Get('feedback')
    feedback(@Req() req: Request) {
        return { query: req.query };
    }
}