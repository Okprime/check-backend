import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsString()
  emailOrPhone: string;

  @ApiProperty()
  @IsString()
  password: string;
}
