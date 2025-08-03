import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProductHistoryService } from './product-history.service';
import { AuthGuard } from 'src/common/Guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('product-history')
export class ProductHistoryController {
  constructor(private readonly productHistoryService: ProductHistoryService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiBearerAuth()
  findAll(@Req() req: Request) {
    const SellerId = req['user'].sub;
    return this.productHistoryService.findAll(SellerId);
  }
}
