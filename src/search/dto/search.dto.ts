import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { PaginationDTO } from '../../common/dto/pagination.dto';

export class SearchDTO extends PaginationDTO {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  query: string;
}
