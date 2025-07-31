import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    example: 'ali@example.com',
    description: 'Admin email manzili',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Parol (raqam bo‘lishi mumkin)',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
