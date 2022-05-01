import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  restaurantId: number;

  @ApiProperty()
  @IsNumber()
  price: number;
}
