import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBorrowedProductDto } from './dto/create-borrowed-product.dto';
import { UpdateBorrowedProductDto } from './dto/update-borrowed-product.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class BorrowedProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateBorrowedProductDto) {
    if (!await this.prisma.debtor.findFirst({ where: { id: dto.debtorId } })) {
      throw new BadRequestException("Debtor id not found !")
    }
  }

  findAll() {
    return `This action returns all borrowedProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} borrowedProduct`;
  }

  update(id: number, updateBorrowedProductDto: UpdateBorrowedProductDto) {
    return `This action updates a #${id} borrowedProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} borrowedProduct`;
  }
}
