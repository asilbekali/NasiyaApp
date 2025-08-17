import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateMessageSampleDto } from './dto/create-message-sample.dto';
import { UpdateMessageSampleDto } from './dto/update-message-sample.dto';

@Injectable()
export class MessageSampleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMessageSampleDto: CreateMessageSampleDto, sellerId: number) {
    return this.prisma.messageSample.create({
      data: {
        message: createMessageSampleDto.message,
        sellerId,
      },
    });
  }

  async findAll() {
    return this.prisma.messageSample.findMany({
      include: {
        seller: true,
      },
    });
  }

  async findOne(id: number) {
    const message = await this.prisma.messageSample.findUnique({
      where: { id },
      include: { seller: true },
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async update(id: number, updateMessageSampleDto: UpdateMessageSampleDto, sellerId: number) {
    const existing = await this.prisma.messageSample.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Message with ID ${id} not found`);

    return this.prisma.messageSample.update({
      where: { id },
      data: {
        ...updateMessageSampleDto,
        sellerId,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.messageSample.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Message with ID ${id} not found`);

    return this.prisma.messageSample.delete({ where: { id } });
  }
}
