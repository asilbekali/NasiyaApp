import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebtorDto {
  @ApiProperty({ example: 'Ali Valiyev' })
  @IsString()
  name: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'Toshkent, Yunusobod tuman' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Doimiy mijoz' })
  @IsString()
  note: string;
}
