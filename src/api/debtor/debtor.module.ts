import { Module } from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { DebtorController } from './debtor.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRETKEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [DebtorController],
  providers: [DebtorService],
})
export class DebtorModule {}
