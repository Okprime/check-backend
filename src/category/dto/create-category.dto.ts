import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;
}
