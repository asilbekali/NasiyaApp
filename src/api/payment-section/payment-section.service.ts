import { Injectable } from '@nestjs/common';
import { CreatePaymentSectionDto } from './dto/create-payment-section.dto';
import { UpdatePaymentSectionDto } from './dto/update-payment-section.dto';

@Injectable()
export class PaymentSectionService {
  create(createPaymentSectionDto: CreatePaymentSectionDto) {
    return 'This action adds a new paymentSection';
  }

  findAll() {
    return `This action returns all paymentSection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentSection`;
  }

  update(id: number, updatePaymentSectionDto: UpdatePaymentSectionDto) {
    return `This action updates a #${id} paymentSection`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentSection`;
  }
}
