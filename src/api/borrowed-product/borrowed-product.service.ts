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

  const startDate = new Date(); // yaratish vaqti
  const termDate = new Date(dto.term); // berilgan muddat

  // Faqat sanani tekshirish uchun vaqtni 00:00 ga o‘rnatish
  startDate.setHours(0, 0, 0, 0);
  termDate.setHours(0, 0, 0, 0);

  // Orqaga sanalarni bloklash
  if (termDate.getTime() < startDate.getTime()) {
    throw new BadRequestException('Term date cannot be in the past');
  }

  // Oylar farqini hisoblash
  let monthsDiff =
    (termDate.getFullYear() - startDate.getFullYear()) * 12 +
    (termDate.getMonth() - startDate.getMonth());

  // Kunlar farqini hisoblash va qo‘shimcha oy qo‘shish
  if (termDate.getDate() >= startDate.getDate()) {
    monthsDiff += 1;
  }

  if (monthsDiff <= 0) {
    throw new BadRequestException('Term difference must be at least 1 month');
  }

  // Oylik to‘lovni hisoblash
  const monthPayment = Math.ceil(dto.totalAmount / monthsDiff);

  // Borrowed product yaratish
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

  // Rasmlarni qo‘shish
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

  // To‘liq ma’lumotni qaytarish
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
        debtor: {
          include: {
            debtroPhoneNumber: true, // telefon raqamlarini ham qo'shish
          },
        },
        borrowedProductImage: true,
        paymentHistory: true,
      },
    });
  }

  async findOne(id: number) {
    const borrowedProduct = await this.prisma.borrowedProduct.findUnique({
      where: { id },
      include: {
        debtor: {
          include: {
            debtroPhoneNumber: true, // telefon raqamlarini ham qo'shish
          },
        },
        borrowedProductImage: true,
        paymentHistory: true,
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
      include: { borrowedProductImage: true }, // oldingi rasmalarni olish uchun
    });
    if (!existing) {
      throw new NotFoundException(`BorrowedProduct with id ${id} not found`);
    }

    // Asosiy maydonlarni yangilash
    const updatedBorrowedProduct = await this.prisma.borrowedProduct.update({
      where: { id },
      data: {
        productName: dto.productName ?? existing.productName,
        term: dto.term ? new Date(dto.term) : existing.term,
        totalAmount: dto.totalAmount ?? existing.totalAmount,
        note: dto.note ?? existing.note,
        debtorId: dto.debtorId ?? existing.debtorId,
      },
    });

    // Rasmlar bo'lsa, eskilarini o'chirib, yangilarini qo'shish
    if (dto.images && dto.images.length > 0) {
      // 1. Eskilarini o'chirish
      await this.prisma.borrowedProductImage.deleteMany({
        where: { borrowedProductId: id },
      });

      // 2. Yangi rasmlarni yaratish
      await Promise.all(
        dto.images.map((imageUrl) =>
          this.prisma.borrowedProductImage.create({
            data: {
              borrowedProductId: id,
              image: imageUrl,
            },
          }),
        ),
      );
    }

    // To‘liq yangilangan ma’lumotni qaytarish
    return await this.prisma.borrowedProduct.findUnique({
      where: { id },
      include: {
        debtor: true,
        borrowedProductImage: true,
        paymentHistory: true,
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
