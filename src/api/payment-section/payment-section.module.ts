import { Module } from '@nestjs/common';
import { PaymentSectionService } from './payment-section.service';
import { PaymentSectionController } from './payment-section.controller';

@Module({
  controllers: [PaymentSectionController],
  providers: [PaymentSectionService],
})
export class PaymentSectionModule {}
