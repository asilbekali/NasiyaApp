import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';

@Injectable()
export class DebtorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDebtorDto, token: Request) {
    const SellerId = token['user'].sub;

    const existingSeller = await this.prisma.seller.findFirst({
      where: { id: SellerId },
    });
    if (!existingSeller) {
      throw new NotFoundException(`Seller with id ${SellerId} not found`);
    }

    const newDebtor = await this.prisma.debtor.create({
      data: {
        name: dto.name,
        address: dto.address,
        note: dto.note,
        seller: {
          connect: { id: SellerId },
        },
        role: 'debtor',
      },
    });

    if (dto.images && dto.images.length > 0) {
      for (const image of dto.images) {
        await this.prisma.debtor_image.create({
          data: {
            debtorId: newDebtor.id,
            image: image,
          },
        });
      }
    }

    if (dto.phoneNumbers && dto.phoneNumbers.length > 0) {
      for (const number of dto.phoneNumbers) {
        await this.prisma.debtroPhoneNumber.create({
          data: {
            debtorId: newDebtor.id,
            number: number,
          },
        });
      }
    }

    return newDebtor;
  }

  async findAll() {
    return await this.prisma.debtor.findMany({
      include: {
        borrowedProduct: true,
        debtor_image: true,
        debtroPhoneNumber: true,
      },
    });
  }

  async findOne(id: number) {
    const debtor = await this.prisma.debtor.findUnique({
      where: { id },
      include: {
        debtor_image: true,
        debtroPhoneNumber: true,
        borrowedProduct: true,
      },
    });
    if (!debtor) throw new NotFoundException(`Debtor with id ${id} not found`);
    return debtor;
  }

async update(id: number, updateDebtorDto: UpdateDebtorDto) {
  const debtor = await this.prisma.debtor.findUnique({ where: { id } });
  if (!debtor) throw new NotFoundException(`Debtor with id ${id} not found`);

  // DTO dan phoneNumbers ni ajratib olish
  const { phoneNumbers, ...debtorData } = updateDebtorDto;

  // 1. debtor jadvalidagi asosiy maydonlarni yangilash
  const updatedDebtor = await this.prisma.debtor.update({
    where: { id },
    data: debtorData,
  });

  // 2. Agar phoneNumbers bo'lsa, telefon raqamlarini yangilash
  if (phoneNumbers) {
    // Avvalgi telefon raqamlarini o'chirish
    await this.prisma.debtroPhoneNumber.deleteMany({
      where: { debtorId: id },
    });

    // Yangi telefon raqamlarini qo'shish
    for (const number of phoneNumbers) {
      await this.prisma.debtroPhoneNumber.create({
        data: {
          debtorId: id,
          number,
        },
      });
    }
  }

  return updatedDebtor;
}

  async remove(id: number) {
    const debtor = await this.prisma.debtor.findUnique({ where: { id } });
    if (!debtor) throw new NotFoundException(`Debtor with id ${id} not found`);

    await this.prisma.$transaction(async (tx) => {
      // 1. Debtor image larini o‘chirish
      await tx.debtor_image.deleteMany({
        where: { debtorId: id },
      });

      // 2. Telefon raqamlarini o‘chirish
      await tx.debtroPhoneNumber.deleteMany({
        where: { debtorId: id },
      });

      // 3. Message larni o‘chirish
      await tx.message.deleteMany({
        where: { debtorId: id },
      });

      // 4. Borrowed product larni olish
      const borrowedProducts = await tx.borrowedProduct.findMany({
        where: { debtorId: id },
        select: { id: true },
      });
      const borrowedProductIds = borrowedProducts.map((bp) => bp.id);

      if (borrowedProductIds.length > 0) {
        // 5. Borrowed product image larini o‘chirish
        await tx.borrowedProductImage.deleteMany({
          where: { borrowedProductId: { in: borrowedProductIds } },
        });

        // 6. Payment history ni o‘chirish
        await tx.paymentHistory.deleteMany({
          where: {
            OR: [
              { debtorId: id },
              { borrowedProductId: { in: borrowedProductIds } },
            ],
          },
        });

        // 7. Borrowed product larni o‘chirish
        await tx.borrowedProduct.deleteMany({
          where: { id: { in: borrowedProductIds } },
        });
      }

      // 8. Oxirida debtor ni o‘chirish
      await tx.debtor.delete({ where: { id } });
    });

    return { message: `Debtor with id ${id} and all related data deleted` };
  }
}
