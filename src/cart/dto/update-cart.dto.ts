import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CartStatus } from '../types/cart.types';

export class UpdateCartDto {
  @ApiProperty({ default: CartStatus.PROCESSING })
  @IsString()
  status: CartStatus;
}
