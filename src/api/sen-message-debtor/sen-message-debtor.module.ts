import { Module } from '@nestjs/common';
import { SenMessageDebtorService } from './sen-message-debtor.service';
import { SenMessageDebtorController } from './sen-message-debtor.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRETKEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [SenMessageDebtorController],
  providers: [SenMessageDebtorService],
})
export class SenMessageDebtorModule {}
