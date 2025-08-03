import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBorrowedProductDto } from './dto/create-borrowed-product.dto';
import { UpdateBorrowedProductDto } from './dto/update-borrowed-product.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class BorrowedProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBorrowedProductDto) {
    const debtor = await this.prisma.debtor.findUnique({
      where: { id: dto.debtorId },
    });
    if (!debtor) {
      throw new BadRequestException('Debtor id not found!');
    }

    const createAt = new Date();
    const termDate = new Date(dto.term);

    if (termDate <= createAt) {
      throw new BadRequestException('Term date must be in the future');
    }

    const monthsDiff =
      (termDate.getFullYear() - createAt.getFullYear()) * 12 +
      (termDate.getMonth() - createAt.getMonth());

    if (monthsDiff <= 0) {
      throw new BadRequestException('Term difference must be at least 1 month');
    }

    const monthPayment = Math.ceil(dto.totalAmount / monthsDiff);

    const borrowedProduct = await this.prisma.borrowedProduct.create({
      data: {
        productName: dto.productName,
        term: termDate,
        totalAmount: dto.totalAmount,
        note: dto.note,
        debtorId: dto.debtorId,
        monthPayment,
      },
      include: {
        debtor: true,
      },
    });

    if (dto.images && dto.images.length > 0) {
      await Promise.all(
        dto.images.map(async (item) => {
          await this.prisma.borrowedProductImage.create({
            data: {
              borrowedProductId: borrowedProduct.id,
              image: item,
            },
          });
        }),
      );
    }

    const fullBorrowedProduct = await this.prisma.borrowedProduct.findUnique({
      where: { id: borrowedProduct.id },
      include: {
        debtor: true,
        borrowedProductImage: true,
      },
    });

    return fullBorrowedProduct;
  }

  async findAll() {
    return await this.prisma.borrowedProduct.findMany({
      include: {
        debtor: true,
        borrowedProductImage: true,
        payment: true,
      },
    });
  }

  async findOne(id: number) {
    const borrowedProduct = await this.prisma.borrowedProduct.findUnique({
      where: { id },
      include: {
        debtor: true,
        borrowedProductImage: true,
        payment: true,
      },
    });

    if (!borrowedProduct) {
      throw new NotFoundException(`BorrowedProduct with id ${id} not found`);
    }

    return borrowedProduct;
  }

  async update(id: number, dto: UpdateBorrowedProductDto) {
    const existing = await this.prisma.borrowedProduct.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`BorrowedProduct with id ${id} not found`);
    }

    return await this.prisma.borrowedProduct.update({
      where: { id },
      data: {
        productName: dto.productName ?? existing.productName,
        term: dto.term ? new Date(dto.term) : existing.term,
        totalAmount: dto.totalAmount ?? existing.totalAmount,
        note: dto.note ?? existing.note,
        debtorId: dto.debtorId ?? existing.debtorId,
      },
      include: {
        debtor: true,
        borrowedProductImage: true,
        payment: true,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.borrowedProduct.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`BorrowedProduct with id ${id} not found`);
    }

    return await this.prisma.borrowedProduct.delete({ where: { id } });
  }
}
