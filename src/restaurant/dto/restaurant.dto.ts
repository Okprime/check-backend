import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { MenuList } from '../../menu/dto/menu.dto';

@Exclude()
class Manager {
  @Expose()
  @ApiProperty()
  @IsString()
  id: string;

  @Expose()
  @ApiProperty()
  @IsString()
  firstName: string;

  @Expose()
  @ApiProperty()
  @IsString()
  lastName: string;

  @Expose()
  @ApiProperty()
  @IsString()
  role: string;

  @Expose()
  @ApiProperty()
  @IsString()
  email: string;
}

@Exclude()
export class RestaurantDTO {
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
  @Type(() => Manager)
  manager: Manager;

  @Expose()
  @ApiProperty()
  @Type(() => MenuList)
  menu: MenuList;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;
}
