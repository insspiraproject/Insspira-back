import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { Payment } from './payment.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() dto: Partial<Payment>) {
    return this.paymentsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.paymentsService.findOne(id);
  }
}