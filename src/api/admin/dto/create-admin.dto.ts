import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsInt } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateAdminDto {
  @ApiProperty({
    example: 'Ali Valiyev',
    description: 'Administratorning to‘liq ismi',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'ali@example.com',
    description: 'Administrator email manzili',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 123456,
    description: 'Administratorning paroli (raqam shaklida saqlanadi)',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'https://example.com/images/admin.jpg',
    description: 'Rasm URL manzili',
  })
  @IsNotEmpty()
  @IsString()
  image: string;
}
