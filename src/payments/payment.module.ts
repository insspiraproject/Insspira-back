import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Payment])],
    providers: [PaymentsService],
    controllers: [PaymentsController],
    exports: [PaymentsService],
})
export class PaymentsModule {}