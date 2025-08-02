import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';
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

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
