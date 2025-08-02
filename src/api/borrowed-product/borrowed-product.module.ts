import { Module } from '@nestjs/common';
import { BorrowedProductService } from './borrowed-product.service';
import { BorrowedProductController } from './borrowed-product.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BorrowedProductController],
  providers: [BorrowedProductService],
})
export class BorrowedProductModule {}
