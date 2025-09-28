import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,
    ) {}

    async create(data: Partial<Payment>): Promise<Payment> {
        const payment = this.paymentRepo.create(data);
        return await this.paymentRepo.save(payment);
    }

    async findAll(): Promise<Payment[]> {
        return this.paymentRepo.find({ relations: ['user', 'plan'] });
    }

    async findOne(id: number): Promise<Payment | null> {
        return this.paymentRepo.findOne({
        where: { id },
        relations: ['user', 'plan'],
        });
    }
}