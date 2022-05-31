import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNumber()
  amount: number;
}
