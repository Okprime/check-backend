import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';
import { CategoryDTO } from '../../category/dto/category.dto';

@Exclude()
class RestaurantItemDTO {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  image: string;

  @Expose()
  @ApiProperty()
  address: string;

  @Expose()
  @ApiProperty()
  city: string;

  @Expose()
  @ApiProperty()
  noOfTables: number;

  @Expose()
  @ApiProperty()
  isDeleted: boolean;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;
}

@Exclude()
export class MenuList {
  @Expose()
  @ApiProperty()
  @IsString()
  id: string;

  @Expose()
  @ApiProperty()
  @IsString()
  name: string;

  @Expose()
  @ApiProperty()
  @IsString()
  description: string;

  @Expose()
  @ApiProperty()
  @IsString()
  price: string;

  @Expose()
  @ApiProperty()
  @Type(() => CategoryDTO)
  category: CategoryDTO;

  @Expose()
  @ApiProperty()
  @IsBoolean()
  isAvailable: boolean;

  @Expose()
  @ApiProperty()
  @Type(() => RestaurantItemDTO)
  restaurant: RestaurantItemDTO;
}
