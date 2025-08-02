import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBorrowedProductDto } from './dto/create-borrowed-product.dto';
import { UpdateBorrowedProductDto } from './dto/update-borrowed-product.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class BorrowedProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBorrowedProductDto) {
    return this.prisma.borrowedProduct.create({
      data: {
        productName: dto.productName,
        term: new Date(dto.term),
        totalAmount: dto.totalAmount,
        note: dto.note,
        debtorId: dto.debtorId,
      },
      include: {
        borrowedProductImage: true,
        payment: true,
        debtor: true,
      },
    });
  }

  async findAll() {
    return this.prisma.borrowedProduct.findMany({
      include: {
        borrowedProductImage: true,
        payment: true,
        debtor: true,
      },
    });
  }

  async findOne(id: number) {
    const borrowedProduct = await this.prisma.borrowedProduct.findUnique({
      where: { id },
      include: {
        borrowedProductImage: true,
        payment: true,
        debtor: true,
      },
    });
    if (!borrowedProduct) {
      throw new NotFoundException(`BorrowedProduct with id ${id} not found`);
    }
    return borrowedProduct;
  }

  async update(id: number, dto: UpdateBorrowedProductDto) {
    const existingProduct = await this.prisma.borrowedProduct.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`BorrowedProduct with id ${id} not found`);
    }

    return this.prisma.borrowedProduct.update({
      where: { id },
      data: {
        productName: dto.productName ?? existingProduct.productName,
        term: dto.term ? new Date(dto.term) : existingProduct.term,
        totalAmount: dto.totalAmount ?? existingProduct.totalAmount,
        note: dto.note ?? existingProduct.note,
        debtorId: dto.debtorId ?? existingProduct.debtorId,
      },
      include: {
        borrowedProductImage: true,
        payment: true,
        debtor: true,
      },
    });
  }

  async remove(id: number) {
    const existingProduct = await this.prisma.borrowedProduct.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`BorrowedProduct with id ${id} not found`);
    }

    return this.prisma.borrowedProduct.delete({
      where: { id },
    });
  }
}
