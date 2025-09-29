import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MercadoPagoService } from './mercadopago.service';
import { MercadoPagoController } from '../../rest/controller/mercadopago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../entities/payment.entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Payment])
  ],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}