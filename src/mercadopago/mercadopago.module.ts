import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MercadoPagoService } from './mercadopago.service';
import { MercadoPagoController } from './mercadopago.controller';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [MercadoPagoService],
    controllers: [MercadoPagoController],
    exports: [MercadoPagoService],
})
export class MercadoPagoModule {}