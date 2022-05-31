import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transferToId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}
