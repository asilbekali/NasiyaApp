import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessageSampleService } from './message-sample.service';
import { CreateMessageSampleDto } from './dto/create-message-sample.dto';
import { UpdateMessageSampleDto } from './dto/update-message-sample.dto';
import { RoleDec } from 'src/common/decoratos/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/Guards/roles.guard';
import { AuthGuard } from 'src/common/Guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Message Samples')
@ApiBearerAuth()
@Controller('message-sample')
export class MessageSampleController {
  constructor(private readonly messageSampleService: MessageSampleService) {}

  @RoleDec(Role.ADMIN, Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message successfully created' })
  async create(
    @Body() createMessageSampleDto: CreateMessageSampleDto,
    @Req() req: Request,
  ) {
    const sellerId = req['user'].sub;
    return this.messageSampleService.create(createMessageSampleDto, sellerId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all messages' })
  findAll() {
    return this.messageSampleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one message by ID' })
  findOne(@Param('id') id: string) {
    return this.messageSampleService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a message by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateMessageSampleDto: UpdateMessageSampleDto,
    @Req() req: Request,
  ) {
    const sellerId = req['user'].sub;
    return this.messageSampleService.update(
      +id,
      updateMessageSampleDto,
      sellerId,
    );
  }

  @RoleDec(Role.ADMIN, Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message by ID' })
  remove(@Param('id') id: string) {
    return this.messageSampleService.remove(+id);
  }
}
