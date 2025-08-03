import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentSectionService } from './payment-section.service';
import {
  CreatePaymentSectionDto,
  PayAsYouWishDto,
} from './dto/create-payment-section.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/Guards/auth.guard';
import { RemainingMonthsDto } from './dto/RemainingMonthsDto';
import { RolesGuard } from 'src/common/Guards/roles.guard';
import { RoleDec } from 'src/common/decoratos/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('payment-section')
export class PaymentSectionController {
  constructor(private readonly paymentSectionService: PaymentSectionService) {}

  @UseGuards(AuthGuard)
  @Post('one-month-pay')
  @ApiBearerAuth()
  oneMonthPay(@Body() dto: CreatePaymentSectionDto, @Req() req: Request) {
    const SellerId = req['user'].sub;
    console.log(SellerId);

    return this.paymentSectionService.oneMonthPay(dto, SellerId);
  }

  @UseGuards(AuthGuard)
  @Post('pay-as-you-wish')
  payAsYouWish(@Body() dto: PayAsYouWishDto, @Req() req: Request) {
    const SellerId = req['user'].sub;
    return this.paymentSectionService.payAsYouWish(dto, SellerId);
  }

  @RoleDec(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('remaining-months')
  getRemainingMonths(@Body() dto: RemainingMonthsDto) {
    return this.paymentSectionService.calculateRemainingMonths(dto);
  }
}
