import { Module } from '@nestjs/common';
import { ProductHistoryService } from './product-history.service';
import { ProductHistoryController } from './product-history.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRETKEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ProductHistoryController],
  providers: [ProductHistoryService],
})
export class ProductHistoryModule {}
