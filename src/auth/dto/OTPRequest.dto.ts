import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class OTPRequestDTO {
  @IsString()
  // @IsPhoneNumber()
  @ApiProperty()
  phone: string;
}
