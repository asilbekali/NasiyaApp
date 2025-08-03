import { Module } from '@nestjs/common';
import { PaymentSectionService } from './payment-section.service';
import { PaymentSectionController } from './payment-section.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentSectionController],
  providers: [PaymentSectionService],
})
export class PaymentSectionModule {}
