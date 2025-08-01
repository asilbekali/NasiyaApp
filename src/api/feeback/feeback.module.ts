import { Module } from '@nestjs/common';
import { FeebackService } from './feeback.service';
import { FeebackController } from './feeback.controller';
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
  controllers: [FeebackController],
  providers: [FeebackService],
})
export class FeebackModule {}
