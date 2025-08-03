import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { AuthGuard } from 'src/common/Guards/auth.guard';
import { RolesGuard } from 'src/common/Guards/roles.guard';
import { RoleDec } from 'src/common/decoratos/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { LoginSellerDto } from './dto/login-seller.dto';
import { ApiQuery } from '@nestjs/swagger';
import { PaymentDto } from './dto/payment.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @RoleDec(Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('month-total')
  thisMonthTotal(@Req() req: Request) {
    const userId = req['user'].sub;
    console.log(userId);

    return this.sellerService.thisMonthTotal(userId);
  }

  @Post('login')
  login(@Body() loginDto: LoginSellerDto) {
    return this.sellerService.login(loginDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.create(createSellerDto);
  }

  @RoleDec(Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('payment')
  payment(@Body() paymentDto: PaymentDto, @Req() req: Request) {
    const userId = req['user'].sub;
    return this.sellerService.payment(paymentDto.money, userId);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter by name',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Boolean,
    description: 'Filter by status',
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
    @Query('status') status?: boolean,
  ) {
    const parsedStatus = status !== undefined ? status === true : undefined;

    return this.sellerService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      name,
      status: parsedStatus,
    });
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(+id, updateSellerDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(+id);
  }
}
