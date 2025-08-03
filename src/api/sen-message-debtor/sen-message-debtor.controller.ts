import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SenMessageDebtorService } from './sen-message-debtor.service';
import { CreateMessageDto } from './dto/create-sen-message-debtor.dto';
import { UpdateSenMessageDebtorDto } from './dto/update-sen-message-debtor.dto';
import { AuthGuard } from 'src/common/Guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('sen-message-debtor')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class SenMessageDebtorController {
  constructor(
    private readonly senMessageDebtorService: SenMessageDebtorService,
  ) {}

  @Post()
  create(@Body() dto: CreateMessageDto, @Req() req: any) {
    const sellerId = req['user'].sub;
    return this.senMessageDebtorService.create(dto, sellerId);
  }

  @Get()
  findAll(@Req() req: any) {
    const sellerId = req.user.sub;
    return this.senMessageDebtorService.findAll(sellerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const sellerId = req.user.sub;
    return this.senMessageDebtorService.findOne(+id, sellerId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
    @Req() req: any,
  ) {
    const sellerId = req['user'].sub;
    return this.senMessageDebtorService.update(+id, dto, sellerId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const sellerId = req.user.sub;
    return this.senMessageDebtorService.remove(+id, sellerId);
  }
}
