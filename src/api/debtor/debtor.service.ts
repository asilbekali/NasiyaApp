import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';

@Injectable()
export class DebtorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDebtorDto, token: Request) {
    const SellerId = await token['user'].sub;

    if (!(await this.prisma.seller.findFirst({ where: { id: SellerId } }))) {
      throw new NotFoundException(`Seller with id ${SellerId} not found`);
    }
    const newDebtor = await this.prisma.debtor.create({
      data: {
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        address: dto.address,
        note: dto.note,
        seller: {
          connect: { id: SellerId },
        },
        role: 'debtor',
      },
    });

    if (dto.images && dto.images.length > 0) {
      for (const item of dto.images) {
        await this.prisma.debtor_image.create({
          data: {
            debtorId: newDebtor.id,
            image: item,
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
        seller: true,
      },
    });
  }

  async findOne(id: number) {
    const debtor = await this.prisma.debtor.findUnique({ where: { id } });
    if (!debtor) throw new NotFoundException(`Debtor with id ${id} not found`);
    return debtor;
  }

  async update(id: number, updateDebtorDto: UpdateDebtorDto) {
    const debtor = await this.prisma.debtor.findUnique({ where: { id } });
    if (!debtor) throw new NotFoundException(`Debtor with id ${id} not found`);

    return await this.prisma.debtor.update({
      where: { id },
      data: updateDebtorDto,
    });
  }

  async remove(id: number) {
    const debtor = await this.prisma.debtor.findUnique({ where: { id } });
    if (!debtor) throw new NotFoundException(`Debtor with id ${id} not found`);

    return await this.prisma.debtor.delete({ where: { id } });
  }
}
