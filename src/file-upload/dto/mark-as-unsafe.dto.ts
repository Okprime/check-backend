import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class GetMarkedAsPlayedQueryParams {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  markedAsPlayed: boolean;
}
