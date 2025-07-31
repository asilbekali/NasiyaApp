import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { MulterModule } from 'src/infrastructure/lib/multe-r/multer.module';
import { DebtorModule } from './debtor/debtor.module';
import { SellerModule } from './seller/seller.module';

@Module({
  imports: [AdminModule, MulterModule, DebtorModule, SellerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
