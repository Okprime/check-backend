import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateMenuDto {
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  price?: number;
}
