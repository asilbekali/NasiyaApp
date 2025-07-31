import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSellerDto } from './create-seller.dto';

export class UpdateSellerDto extends PartialType(CreateSellerDto) {
  @ApiProperty({ example: 'Ali Valiyev', required: false })
  name?: string;

  @ApiProperty({ example: '+998901234567', required: false })
  phoneNumber?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  image?: string;

  @ApiProperty({ example: true, required: false })
  status?: boolean;

  @ApiProperty({ example: 'newsecurepassword123', required: false })
  password?: string;
}
