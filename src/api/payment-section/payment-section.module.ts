import { Module } from '@nestjs/common';
import { PaymentSectionService } from './payment-section.service';
import { PaymentSectionController } from './payment-section.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRETKEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [PaymentSectionController],
  providers: [PaymentSectionService],
})
export class PaymentSectionModule {}
