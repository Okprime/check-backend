import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  managerEmail: string;

  @ApiProperty()
  @IsNumber()
  noOfTables: number;
}
