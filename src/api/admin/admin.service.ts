import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptEncryption } from 'src/infrastructure/lib/bcrypt';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AdminService {
  private readonly jwt: JwtService;
  constructor(private readonly prisma: PrismaService) {}

  async register(createAdminDto: CreateAdminDto) {
    const { email, password, name, image } = createAdminDto;

    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new BadRequestException(
        'Bunday email bilan admin allaqachon mavjud',
      );
    }

    const hashedPassword = await BcryptEncryption.encrypt(password);

    const newAdmin = await this.prisma.admin.create({
      data: {
        email,
        password: String(hashedPassword),
        name,
        image,
        role: 'admin',
      },
    });

    return {
      message: 'Admin muvaffaqiyatli ro‘yxatdan o‘tdi',
      data: newAdmin,
    };
  }

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findFirst({ where: { email } });

    if (!admin) {
      throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
    }

    const isMatch = await BcryptEncryption.compare(password, admin.password);

    if (!isMatch) throw new UnauthorizedException('Email yoki parol noto‘g‘ri');

    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    const token = await this.jwt.signAsync(payload);

    return {
      message: 'Muvaffaqiyatli tizimga kirildi',
      access_token: token,
    };
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
