import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  create(createSellerDto: CreateSellerDto) {
    return 'This action adds a new seller';
  }

  login(createSellerDto: CreateSellerDto) {
    return 'This action adds a new seller';
  }

  findAll() {
    return `This action returns all seller`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seller`;
  }

  update(id: number, updateSellerDto: UpdateSellerDto) {
    return `This action updates a #${id} seller`;
  }

  remove(id: number) {
    return `This action removes a #${id} seller`;
  }
}
