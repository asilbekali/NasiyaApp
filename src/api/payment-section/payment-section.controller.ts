import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentSectionService } from './payment-section.service';
import { CreatePaymentSectionDto } from './dto/create-payment-section.dto';
import { UpdatePaymentSectionDto } from './dto/update-payment-section.dto';

@Controller('payment-section')
export class PaymentSectionController {
  constructor(private readonly paymentSectionService: PaymentSectionService) {}



  @Post()
  create(@Body() createPaymentSectionDto: CreatePaymentSectionDto) {
    return this.paymentSectionService.create(createPaymentSectionDto);
  }

  // @Get()
  // findAll() {
  //   return this.paymentSectionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.paymentSectionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePaymentSectionDto: UpdatePaymentSectionDto) {
  //   return this.paymentSectionService.update(+id, updatePaymentSectionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.paymentSectionService.remove(+id);
  // }




  // add mothly pay
  // add pay as you wish
  // making multiple monthly payments at once
}
