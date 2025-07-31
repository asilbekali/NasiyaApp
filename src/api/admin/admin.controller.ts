import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/LoginAdmin.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/Guards/auth.guard';
import { RolesGuard } from 'src/common/Guards/roles.guard';
import { RoleDec } from 'src/common/decoratos/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  @ApiOperation({ summary: 'Yangi admin ro‘yxatdan o‘tkazish' })
  @ApiResponse({ status: 201, description: 'Admin muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 400, description: 'Email allaqachon mavjud' })
  @ApiBody({ type: CreateAdminDto })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.register(createAdminDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Admin login bo‘ladi' })
  @ApiResponse({ status: 200, description: 'Token yoki muvaffaqiyatli login' })
  @ApiResponse({ status: 401, description: 'Email yoki parol noto‘g‘ri' })
  @ApiBody({ type: LoginAdminDto })
  login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto.email, loginAdminDto.password);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Adminni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Admin muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 400, description: 'Bunday IDga ega admin topilmadi' })
  @ApiParam({ name: 'id', type: Number, description: 'Adminning ID raqami' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }
}
