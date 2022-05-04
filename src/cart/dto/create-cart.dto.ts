import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
export class CreateCartDto {
  @ApiProperty()
  @IsDefined()
  payload: string;
}
