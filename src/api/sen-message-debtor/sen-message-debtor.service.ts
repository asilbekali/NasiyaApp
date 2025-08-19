import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-sen-message-debtor.dto';
import { UpdateSenMessageDebtorDto } from './dto/update-sen-message-debtor.dto';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class SenMessageDebtorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMessageDto, sellerId: number) {
    const debtor = await this.prisma.debtor.findUnique({
      where: { id: dto.debtorId },
    });

    if (!debtor) {
      throw new NotFoundException('Debtor not found');
    }

    if (debtor.sellerId !== sellerId) {
      throw new BadRequestException('This debtor does not belong to you');
    }

    const message = await this.prisma.message.create({
      data: {
        debtorId: dto.debtorId,
        sellerId: sellerId,
        message: dto.message,
        sent: true,
      },
    });

    return { message: 'Message successfully created', data: message };
  }

  async findAll(sellerId: number) {
    const messages = await this.prisma.message.findMany({
      where: { sellerId },
      include: {
        to: { select: { name: true } },
      },
      orderBy: { createAt: 'desc' },
    });

    return messages;
  }

  async findOne(id: number, sellerId: number) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: { to: true },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sellerId !== sellerId) {
      throw new BadRequestException(
        'You are not authorized to access this message',
      );
    }

    return message;
  }

  async update(id: number, dto: CreateMessageDto, sellerId: number) {
    const message = await this.prisma.message.findUnique({ where: { id } });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sellerId !== sellerId) {
      throw new BadRequestException(
        'You are not authorized to update this message',
      );
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id },
      data: { message: dto.message, sent: true },
    });

    return { message: 'Message updated successfully', data: updatedMessage };
  }

  async remove(id: number, sellerId: number) {
    const message = await this.prisma.message.findUnique({ where: { id } });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sellerId !== sellerId) {
      throw new BadRequestException(
        'You are not authorized to delete this message',
      );
    }

    await this.prisma.message.delete({ where: { id } });

    return { message: 'Message deleted successfully' };
  }
}
