import { Controller, Post, Body } from '@nestjs/common';
import { PaymentSectionService } from './payment-section.service';
import {
  CreatePaymentSectionDto,
  PayAsYouWishDto,
} from './dto/create-payment-section.dto';

@Controller('payment-section')
export class PaymentSectionController {
  constructor(private readonly paymentSectionService: PaymentSectionService) {}

  @Post('one-month-pay')
  oneMonthPay(@Body() dto: CreatePaymentSectionDto) {
    return this.paymentSectionService.oneMonthPay(dto);
  }

  @Post('pay-as-you-wish')
  payAsYouWish(@Body() dto: PayAsYouWishDto) {
    return this.paymentSectionService.payAsYouWish(dto);
  }
}
