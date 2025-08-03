import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  CreatePaymentSectionDto,
  PayAsYouWishDto,
} from './dto/create-payment-section.dto';

@Injectable()
export class PaymentSectionService {
  constructor(private readonly prisma: PrismaService) {}
  async oneMonthPay(dto: CreatePaymentSectionDto, SellerId: number) {
    const borrowedProduct = await this.prisma.borrowedProduct.findUnique({
      where: { id: dto.borrowedProductId },
    });

    if (!borrowedProduct) {
      throw new NotFoundException('Borrowed product not found');
    }

    if (borrowedProduct.totalAmount <= 0) {
      await this.prisma.borrowedProduct.delete({
        where: { id: dto.borrowedProductId },
      });
      return { message: 'This product is fully paid and has been removed.' };
    }

    await this.prisma.paymentHistory.create({
      data: {
        borrowedProductId: dto.borrowedProductId,
        debtorId: dto.debtorId,
        amount: borrowedProduct.monthPayment,
      },
    });

    const newTotal = borrowedProduct.totalAmount - borrowedProduct.monthPayment;

    await this.prisma.seller.update({
      where: { id: SellerId },
      data: {
        wallet: {
          increment: borrowedProduct.monthPayment,
        },
      },
    });

    if (newTotal <= 0) {
      await this.prisma.borrowedProduct.delete({
        where: { id: dto.borrowedProductId },
      });
      return {
        message: 'Payment completed. Borrowed product has been removed.',
      };
    } else {
      await this.prisma.borrowedProduct.update({
        where: { id: dto.borrowedProductId },
        data: { totalAmount: newTotal },
      });
      return {
        message: 'One month payment successful',
        remainingAmount: newTotal,
      };
    }
  }

  async payAsYouWish(dto: PayAsYouWishDto, SellerId: number) {
    const borrowedProduct = await this.prisma.borrowedProduct.findUnique({
      where: { id: dto.borrowedProductId },
      include: {
        borrowedProductImage: true, 
      },
    });

    if (!borrowedProduct) {
      throw new NotFoundException('Borrowed product not found');
    }

    if (borrowedProduct.totalAmount <= 0) {
      throw new BadRequestException(
        `This product is already fully paid. Total amount is 0 sum.`,
      );
    }

    if (dto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    if (dto.amount > borrowedProduct.totalAmount) {
      throw new BadRequestException(
        `You cannot pay more than ${borrowedProduct.totalAmount} sum`,
      );
    }

    // PaymentHistory create
    await this.prisma.paymentHistory.create({
      data: {
        borrowedProductId: dto.borrowedProductId,
        debtorId: dto.debtorId,
        amount: dto.amount,
      },
    });

    // Seller walletga qo'shish
    await this.prisma.seller.update({
      where: { id: SellerId },
      data: {
        wallet: {
          increment: dto.amount,
        },
      },
    });

    const newTotal = borrowedProduct.totalAmount - dto.amount;

    // Agar totalAmount 0 yoki undan kichik bo'lsa, faqat xabar beradi, delete qilmaydi
    if (newTotal <= 0) {
      await this.prisma.borrowedProduct.update({
        where: { id: dto.borrowedProductId },
        data: { totalAmount: 0 },
      });

      return {
        message:
          'Payment completed. The total amount is now 0 sum. Further payments are not allowed.',
      };
    } else {
      // Qarzi qolgan bo'lsa, totalAmount ni yangilash
      await this.prisma.borrowedProduct.update({
        where: { id: dto.borrowedProductId },
        data: { totalAmount: newTotal },
      });

      const remainingMonths = Math.ceil(
        newTotal / borrowedProduct.monthPayment,
      );

      return {
        message: `Payment successful. ${remainingMonths} months of payment remaining`,
        remainingAmount: newTotal,
      };
    }
  }
}
