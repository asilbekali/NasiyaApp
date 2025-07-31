import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSellerDto {
  @ApiProperty({
    example: 'Ali Valiyev',
    description: 'Sotuvchining to‘liq ismi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Sotuvchi paroli (kamida 6 ta belgidan iborat)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Sotuvchining telefon raqami',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'ali@example.com',
    description: 'Sotuvchining elektron pochta manzili',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'https://example.com/images/ali.jpg',
    description: 'Sotuvchining rasm manzili (URL formatda)',
  })
  @IsString()
  image: string;
}
