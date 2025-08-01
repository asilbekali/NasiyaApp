import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feeback.dto';
import { UpdateFeebackDto } from './dto/update-feeback.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FeebackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFeedbackDto: CreateFeedbackDto, req: Request) {
    const SellerId = await req['user'].sub;

    return await this.prisma.feedback.create({
      data: {
        message: createFeedbackDto.message,
        sellerId: SellerId,
      },
    });
  }

  async findAll() {
    return await this.prisma.feedback.findMany({
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback topilmadi');
    }

    return feedback;
  }

  async update(id: number, dto: CreateFeedbackDto) {
    const existing = await this.prisma.feedback.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Feedback topilmadi');

    return await this.prisma.feedback.update({
      where: { id },
      data: {
        message: dto.message,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.feedback.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Feedback topilmadi');

    return await this.prisma.feedback.delete({
      where: { id },
    });
  }
}
