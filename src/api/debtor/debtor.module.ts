import { Module } from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { DebtorController } from './debtor.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [DebtorController],
  providers: [DebtorService],
})
export class DebtorModule {}
