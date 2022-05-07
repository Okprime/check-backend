import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateMenuDto {
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  isAvailable: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  price: number;
}
