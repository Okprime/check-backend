import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsNumber } from 'class-validator';

export class CreateCartDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  restaurantId: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  table: number;

  @ApiProperty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  ordersIds: number[];
}

export class CreateCartDtoTest {
  @ApiProperty()
  @IsDefined()
  payload: string;
}
