import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { MulterModule } from 'src/infrastructure/lib/multe-r/multer.module';

@Module({
  imports: [AdminModule, MulterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
