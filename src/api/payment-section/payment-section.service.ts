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

  async oneMonthPay(dto: CreatePaymentSectionDto) {
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

  async payAsYouWish(dto: PayAsYouWishDto) {
    const borrowedProduct = await this.prisma.borrowedProduct.findUnique({
      where: { id: dto.borrowedProductId },
    });

    if (!borrowedProduct) {
      throw new NotFoundException('Borrowed product not found');
    }

    if (borrowedProduct.totalAmount <= 0) {
      throw new BadRequestException('This product is already fully paid');
    }

    if (dto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    await this.prisma.paymentHistory.create({
      data: {
        borrowedProductId: dto.borrowedProductId,
        debtorId: dto.debtorId,
        amount: dto.amount,
      },
    });

    const newTotal = borrowedProduct.totalAmount - dto.amount;

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
      const remainingMonths = Math.ceil(
        newTotal / borrowedProduct.monthPayment,
      );
      return {
        message: `Payment successful. ${remainingMonths} months of payment remaining`,
        remainingAmount: newTotal,
      };
    }
  }

  // async oneMonthPay(dto: CreatePaymentSectionDto) {
  //   const borrowedProduct = await this.prisma.borrowedProduct.findUnique({
  //     where: { id: dto.borrowedProductId },
  //   });

  //   if (!borrowedProduct) {
  //     throw new NotFoundException('Borrowed product not found');
  //   }

  //   if (borrowedProduct.totalAmount <= 0) {
  //     await this.prisma.borrowedProduct.delete({
  //       where: { id: dto.borrowedProductId },
  //     });
  //     return { message: 'This product is fully paid and has been removed.' };
  //   }

  //   await this.prisma.paymentHistory.create({
  //     data: {
  //       borrowedProductId: dto.borrowedProductId,
  //       debtorId: dto.debtorId,
  //       amount: borrowedProduct.monthPayment,
  //     },
  //   });

  //   const newTotal = borrowedProduct.totalAmount - borrowedProduct.monthPayment;

  //   if (newTotal <= 0) {
  //     await this.prisma.borrowedProduct.delete({
  //       where: { id: dto.borrowedProductId },
  //     });
  //     return {
  //       message: 'Payment completed. Borrowed product has been removed.',
  //     };
  //   } else {
  //     await this.prisma.borrowedProduct.update({
  //       where: { id: dto.borrowedProductId },
  //       data: { totalAmount: newTotal },
  //     });
  //     return {
  //       message: 'One month payment successful',
  //       remainingAmount: newTotal,
  //     };
  //   }
  // }

  // async payAsYouWish(dto: PayAsYouWishDto) {
  //   const borrowedProduct = await this.prisma.borrowedProduct.findUnique({
  //     where: { id: dto.borrowedProductId },
  //   });

  //   if (!borrowedProduct) {
  //     throw new NotFoundException('Borrowed product not found');
  //   }

  //   if (borrowedProduct.totalAmount <= 0) {
  //     throw new BadRequestException('This product is already fully paid');
  //   }

  //   if (dto.amount <= 0) {
  //     throw new BadRequestException('Amount must be greater than 0');
  //   }

  //   // Create payment history
  //   await this.prisma.paymentHistory.create({
  //     data: {
  //       borrowedProductId: dto.borrowedProductId,
  //       debtorId: dto.debtorId,
  //       amount: dto.amount,
  //     },
  //   });

  //   // Update borrowed product total amount
  //   const newTotal = borrowedProduct.totalAmount - dto.amount;

  //   if (newTotal <= 0) {
  //     await this.prisma.borrowedProduct.delete({
  //       where: { id: dto.borrowedProductId },
  //     });
  //     return {
  //       message: 'Payment completed. Borrowed product has been removed.',
  //     };
  //   } else {
  //     await this.prisma.borrowedProduct.update({
  //       where: { id: dto.borrowedProductId },
  //       data: { totalAmount: newTotal },
  //     });
  //     const remainingMonths = Math.ceil(
  //       newTotal / borrowedProduct.monthPayment,
  //     );
  //     return {
  //       message: `Payment successful. ${remainingMonths} months of payment remaining`,
  //       remainingAmount: newTotal,
  //     };
  //   }
  // }
}
