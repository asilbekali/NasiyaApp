import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ProductHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(sellerId: number) {
    const debtors = await this.prisma.debtor.findMany({
      where: { sellerId },
      include: {
        paymentHistory: {
          include: {
            borrowedProduct: true,
          },
        },
      },
    });

    return debtors.map((debtor) => ({
      debtorId: debtor.id,
      debtorName: debtor.name,
      paymentHistories: debtor.paymentHistory.map((payment) => ({
        paymentId: payment.id,
        borrowedProductId: payment.borrowedProductId,
        borrowedProductName: payment.borrowedProduct.productName,
        amountPaid: payment.amount,
        paidAt: payment.createAt,
      })),
    }));
  }
}
