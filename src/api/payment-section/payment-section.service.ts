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
import { RemainingMonthsDto } from './dto/RemainingMonthsDto';
import { MultiMonthPayDto } from './dto/MultiMonthPayDto';

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
      throw new BadRequestException(
        'This product is already fully paid. Further payments are not allowed.',
      );
    }

    if (borrowedProduct.totalAmount < borrowedProduct.monthPayment) {
      throw new BadRequestException(
        `Remaining amount is less than a month's payment. Please use "Pay As You Wish" option.`,
      );
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
      await this.prisma.borrowedProduct.update({
        where: { id: dto.borrowedProductId },
        data: { totalAmount: 0 },
      });

      return {
        message:
          'Payment completed. Total amount is now 0 sum. No further payments are allowed.',
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

    // tarixga yozib qo'yamiz
    await this.prisma.paymentHistory.create({
      data: {
        borrowedProductId: dto.borrowedProductId,
        debtorId: dto.debtorId,
        amount: dto.amount,
      },
    });

    // sotuvchiga tushadigan pul
    await this.prisma.seller.update({
      where: { id: SellerId },
      data: {
        wallet: {
          increment: dto.amount,
        },
      },
    });

    // yangi qarz qoldig‘i
    const newTotal = borrowedProduct.totalAmount - dto.amount;

    if (newTotal <= 0) {
      await this.prisma.borrowedProduct.update({
        where: { id: dto.borrowedProductId },
        data: {
          totalAmount: 0,
          monthPayment: 0,
        },
      });

      return {
        message:
          'Payment completed. The total amount is now 0 sum. Further payments are not allowed.',
      };
    } else {
      // qolgan oylarni hisoblaymiz
      const remainingMonths = Math.ceil(
        newTotal / borrowedProduct.monthPayment,
      );

      // yangi oylik to'lovni qayta hisoblaymiz
      const newMonthlyPayment =
        remainingMonths > 0 ? Math.ceil(newTotal / remainingMonths) : 0;

      await this.prisma.borrowedProduct.update({
        where: { id: dto.borrowedProductId },
        data: {
          totalAmount: newTotal,
          monthPayment: newMonthlyPayment,
        },
      });

      return {
        message: `Payment successful. ${remainingMonths} months of payment remaining`,
        remainingAmount: newTotal,
        newMonthlyPayment,
      };
    }
  }

  async calculateRemainingMonths(dto: RemainingMonthsDto) {
    const borrowedProduct = await this.prisma.borrowedProduct.findUnique({
      where: { id: dto.borrowedProductId },
    });

    if (!borrowedProduct) {
      throw new NotFoundException('Borrowed product not found');
    }

    if (borrowedProduct.debtorId !== dto.debtorId) {
      throw new BadRequestException(
        'This borrowed product does not belong to the specified debtor',
      );
    }

    if (borrowedProduct.totalAmount <= 0) {
      return {
        message: 'This product is fully paid. No remaining payments.',
        remainingMonths: 0,
        remainingAmount: 0,
      };
    }

    const remainingMonths = Math.ceil(
      borrowedProduct.totalAmount / borrowedProduct.monthPayment,
    );

    return {
      borrowedProductId: dto.borrowedProductId,
      debtorId: dto.debtorId,
      totalAmount: borrowedProduct.totalAmount,
      monthPayment: borrowedProduct.monthPayment,
      remainingMonths,
    };
  }

  async multiMonthPay(dto: MultiMonthPayDto, SellerId: number) {
    const borrowedProduct = await this.prisma.borrowedProduct.findUnique({
      where: { id: dto.borrowedProductId },
    });

    if (!borrowedProduct) {
      throw new NotFoundException('Borrowed product not found');
    }

    if (borrowedProduct.debtorId !== dto.debtorId) {
      throw new BadRequestException(
        'This borrowed product does not belong to the specified debtor',
      );
    }

    if (borrowedProduct.totalAmount <= 0) {
      throw new BadRequestException(
        'This product is already fully paid. Further payments are not allowed.',
      );
    }

    const remainingMonths = Math.ceil(
      borrowedProduct.totalAmount / borrowedProduct.monthPayment,
    );

    if (dto.monthsToPay > remainingMonths) {
      throw new BadRequestException(
        `You cannot pay more than ${remainingMonths} months. Only ${remainingMonths} months are left.`,
      );
    }

    const totalPayment = dto.monthsToPay * borrowedProduct.monthPayment;

    await this.prisma.paymentHistory.create({
      data: {
        borrowedProductId: dto.borrowedProductId,
        debtorId: dto.debtorId,
        amount: totalPayment,
      },
    });

    await this.prisma.seller.update({
      where: { id: SellerId },
      data: {
        wallet: {
          increment: totalPayment,
        },
      },
    });

    const newTotal = borrowedProduct.totalAmount - totalPayment;

    await this.prisma.borrowedProduct.update({
      where: { id: dto.borrowedProductId },
      data: { totalAmount: newTotal },
    });

    const remainingMonthsAfterPayment = Math.ceil(
      newTotal / borrowedProduct.monthPayment,
    );

    const message =
      newTotal <= 0
        ? 'Payment completed. Total amount is now 0 sum.'
        : `Payment successful. ${remainingMonthsAfterPayment} months of payment remaining`;

    return {
      message,
      remainingAmount: newTotal,
      remainingMonths: remainingMonthsAfterPayment,
    };
  }
}
