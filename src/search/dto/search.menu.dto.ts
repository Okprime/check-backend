import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

@Exclude()
export class SearchMenuList {
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
  @IsString()
  quantity: string;

  @Expose()
  @ApiProperty()
  @IsString()
  image: string;

  @Expose()
  @ApiProperty()
  @IsBoolean()
  isAvailable: boolean;
}
