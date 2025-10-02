import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MercadoPagoService } from './mercadopago.service';
import { MercadoPagoController } from './mercadopago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payments/payment.entity';
import { User } from '../users/entities/user.entity';
import { Plan } from '../plans/plan.entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Payment, User, Plan])
  ],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}