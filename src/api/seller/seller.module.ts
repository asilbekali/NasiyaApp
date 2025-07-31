import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'seller',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
