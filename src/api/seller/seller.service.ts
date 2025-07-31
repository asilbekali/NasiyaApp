import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async create(createSellerDto: CreateSellerDto) {
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

    return {
      message: 'Seller successfully created',
      seller: newSeller,
    };
  }

  async login(createSellerDto: CreateSellerDto) {
    const seller = await this.prisma.seller.findFirst({
      where: { phoneNumber: createSellerDto.phoneNumber },
    });

    if (!seller || seller.password !== createSellerDto.password) {
      throw new NotFoundException('Invalid phone number or password');
    }

    const payload = { sub: seller.id, role: seller.role };
    const token = await this.jwt.signAsync(payload);

    return {
      message: 'Login successful',
      token,
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

  async remove(id: number) {
    await this.prisma.seller.delete({ where: { id } });
    return { message: 'Seller deleted successfully' };
  }
}
