import { Injectable, NotFoundException } from '@nestjs//common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginSellerDto } from './dto/login-seller.dto';
import { MailService } from 'src/common/mail/mail.service';
import { LateDebtor, LateProduct } from './interface/late-debtor.interface';

@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly email: MailService,
  ) {}

  async LatePaymentCustomers(sellerId: number): Promise<{
    sellerId: number;
    lateDebtorsCount: number;
    lateDebtors: LateDebtor[];
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const debtors = await this.prisma.debtor.findMany({
      where: { sellerId },
      include: {
        borrowedProduct: {
          select: {
            id: true,
            productName: true,
            term: true,
            monthPayment: true,
            createAt: true,
          },
        },
        debtroPhoneNumber: {
          select: { number: true },
        },
      },
    });

    const lateDebtors: LateDebtor[] = [];

    for (const debtor of debtors) {
      const lateProducts: LateProduct[] = [];

      for (const product of debtor.borrowedProduct) {
        const paymentDueDay = product.createAt.getDate();
        const today = now.getDate();

        const isPaymentDayPassed = today >= paymentDueDay;

        const isPaidThisMonth = await this.prisma.paymentHistory.findFirst({
          where: {
            borrowedProductId: product.id,
            createAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        const hasPaid = !!isPaidThisMonth;

        if (isPaymentDayPassed && !hasPaid) {
          lateProducts.push({
            borrowedProduct: product.id,
            productName: product.productName,
            term: product.term,
            monthPayment: product.monthPayment,
          });
        }
      }

      if (lateProducts.length > 0) {
        lateDebtors.push({
          debtorId: debtor.id,
          debtorName: debtor.name,
          phoneNumbers: debtor.debtroPhoneNumber.map((pn) => pn.number),
          lateProducts,
        });
      }
    }

    return {
      sellerId,
      lateDebtorsCount: lateDebtors.length,
      lateDebtors,
    };
  }

  async create(createSellerDto: CreateSellerDto) {
    const existingEmail = await this.prisma.seller.findFirst({
      where: { email: createSellerDto.email },
    });

    if (existingEmail) {
      throw new NotFoundException('This email is already registered');
    }

    const existingName = await this.prisma.seller.findFirst({
      where: { name: createSellerDto.name },
    });

    if (existingName) {
      throw new NotFoundException('This name is already taken');
    }

    const newSeller = await this.prisma.seller.create({
      data: {
        name: createSellerDto.name,
        password: createSellerDto.password,
        phoneNumber: createSellerDto.phoneNumber,
        email: createSellerDto.email,
        wallet: 0,
        image: createSellerDto.image,
        status: true,
      },
    });
    this.email.sendEmail(
      createSellerDto.email,
      'Your login user name and password',
      `Login UserName: ${newSeller.name}\nLogin Password: ${createSellerDto.password}`,
    );

    return {
      message: 'Seller successfully created',
      seller: newSeller,
    };
  }

  async payment(money: number, sellerId: number) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
      select: { wallet: true },
    });

    if (!seller) {
      throw new NotFoundException('Seller topilmadi');
    }

    const updatedSeller = await this.prisma.seller.update({
      where: { id: sellerId },
      data: {
        wallet: seller.wallet + money,
      },
    });

    return {
      message: 'Hisobingiz muvaffaqiyatli to‘ldirildi',
      wallet: updatedSeller.wallet,
    };
  }

  async login(loginDto: LoginSellerDto) {
    const seller = await this.prisma.seller.findFirst({
      where: { email: loginDto.email },
    });
    if (!seller || seller.password !== loginDto.password) {
      throw new NotFoundException('Invalid email or password');
    }

    const payload = { sub: seller.id, role: seller.role };
    const token = await this.jwt.signAsync(payload);

    return {
      message: 'Login successful',
      accesToken: token,
    };
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    name?: string;
    status?: boolean;
  }) {
    const { page = 1, limit = 10, name, status } = query;

    const where: any = {};

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (status !== undefined) where.status = status;

    const [total, sellers] = await this.prisma.$transaction([
      this.prisma.seller.count({ where }),
      this.prisma.seller.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createAt: 'desc' },
      }),
    ]);

    return {
      total,
      page,
      limit,
      sellers,
    };
  }

  async findOne(id: number) {
    const seller = await this.prisma.seller.findUnique({ where: { id } });

    if (!seller) {
      throw new NotFoundException(`Seller with id ${id} not found`);
    }

    return seller;
  }

  async update(id: number, updateSellerDto: UpdateSellerDto) {
    const seller = await this.prisma.seller.update({
      where: { id },
      data: updateSellerDto,
    });

    return {
      message: 'Seller updated successfully',
      seller,
    };
  }

  async thisMonthTotal(sellerId: number) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const debtors = await this.prisma.debtor.findMany({
      where: {
        sellerId,
        createAt: {
          gte: startOfMonth,
          lte: now,
        },
      },
      include: {
        borrowedProduct: {
          select: {
            monthPayment: true,
            createAt: true,
            totalAmount: true,
          },
        },
        debtroPhoneNumber: {
          select: {
            number: true,
          },
        },
      },
      orderBy: {
        createAt: 'desc',
      },
    });

    let totalAmount = 0;

    const debtorDetails = debtors.map((debtor) => {
      // Filter out borrowedProducts with totalAmount = 0
      const activeBorrowedProducts = debtor.borrowedProduct.filter(
        (bp) => bp.totalAmount > 0,
      );

      const debtorTotalDebt = activeBorrowedProducts.reduce(
        (sum, bp) => sum + bp.monthPayment,
        0,
      );
      totalAmount += debtorTotalDebt;

      const phoneNumbers = debtor.debtroPhoneNumber.map((pn) => pn.number);

      return {
        id: debtor.id,
        name: debtor.name,
        phoneNumbers,
        totalDebt: debtorTotalDebt,
      };
    });

    // Debtors with no active debts (0 sum) will be excluded
    const filteredDebtors = debtorDetails.filter(
      (debtor) => debtor.totalDebt > 0,
    );

    return {
      sellerId,
      thisMonthDebtorsCount: filteredDebtors.length,
      thisMonthTotalAmount: totalAmount,
      debtors: filteredDebtors,
    };
  }

  async remove(id: number) {
    await this.prisma.seller.delete({ where: { id } });
    return { message: 'Seller deleted successfully' };
  }

  async getSellerDates(sellerId: number) {
    const seller = await this.prisma.seller.findFirst({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with id ${sellerId} not found`);
    }

    return seller;
  }

  async getAllTotalDebtPrice(sellerId: number) {
    const debtors = await this.prisma.debtor.findMany({
      where: { sellerId },
      include: {
        borrowedProduct: {
          select: { totalAmount: true },
        },
      },
    });

    if (!debtors.length) {
      return {
        sellerId,
        totalDebtPrice: 0,
        message: 'No debtors found for this seller',
      };
    }

    // Barcha borrowedProduct totalAmount larini jamlash
    const totalDebtPrice = debtors.reduce((sum, debtor) => {
      const debtorSum = debtor.borrowedProduct.reduce(
        (bpSum, bp) => bpSum + bp.totalAmount,
        0,
      );
      return sum + debtorSum;
    }, 0);

    return {
      sellerId,
      totalDebtPrice,
    };
  }
}
