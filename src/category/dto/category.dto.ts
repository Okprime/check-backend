import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CategoryDTO {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

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
