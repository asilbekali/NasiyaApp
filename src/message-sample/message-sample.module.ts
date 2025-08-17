import { Module } from '@nestjs/common';
import { MessageSampleService } from './message-sample.service';
import { MessageSampleController } from './message-sample.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MessageSampleController],
  providers: [MessageSampleService],
})
export class MessageSampleModule {}
