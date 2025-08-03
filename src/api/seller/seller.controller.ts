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
  ParseIntPipe,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { AuthGuard } from 'src/common/Guards/auth.guard';
import { RolesGuard } from 'src/common/Guards/roles.guard';
import { RoleDec } from 'src/common/decoratos/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { LoginSellerDto } from './dto/login-seller.dto';
import {
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PaymentDto } from './dto/payment.dto';

@ApiTags('Seller')
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @RoleDec(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'This month total debts for seller' })
  @Get('month-total')
  thisMonthTotal(@Req() req: Request) {
    const userId = req['user'].sub;
    return this.sellerService.thisMonthTotal(userId);
  }

  @RoleDec(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Payment done successfully' })
  @Post('payment')
  payment(@Body() paymentDto: PaymentDto, @Req() req: Request) {
    const userId = req['user'].sub;
    return this.sellerService.payment(paymentDto.money, userId);
  }

  @Post('login')
  @ApiOkResponse({ description: 'Login successful, token returned' })
  login(@Body() loginDto: LoginSellerDto) {
    return this.sellerService.login(loginDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOkResponse({ description: 'Seller created successfully' })
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.create(createSellerDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
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
  @ApiOkResponse({ description: 'List of all sellers' })
  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
    @Query('status') status?: boolean,
  ) {
    return this.sellerService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      name,
      status: status !== undefined ? status === true : undefined,
    });
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Single seller by ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.findOne(id);
  }

  @RoleDec(Role.ADMIN, Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Seller updated successfully' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return this.sellerService.update(id, updateSellerDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Seller deleted successfully' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.remove(id);
  }
}
