import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MercadoPagoService } from './mercadopago.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
        provide: 'MERCADOPAGO_CLIENT',
        useFactory: (config: ConfigService) => {
            const mp = require('mercadopago');
            mp.configure({
            access_token: config.get<string>('MP_ACCESS_TOKEN') || '',
            });
            return mp;
        },
        inject: [ConfigService],
        },
        MercadoPagoService,
    ],
    exports: [MercadoPagoService],
})
export class MercadoPagoModule {}