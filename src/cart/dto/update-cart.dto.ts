import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CartStatus } from '../types/cart.types';

export class UpdateCartDto {
  @ApiProperty({ default: CartStatus.PROCESSING })
  @IsString()
  status: CartStatus;

  @ApiPropertyOptional()
  @IsOptional()
  userId?: string;
}
