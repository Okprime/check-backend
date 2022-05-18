import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OTPRequestDTO {
  @IsString()
  @ApiProperty()
  phone: string;
}
