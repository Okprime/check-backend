import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber } from 'class-validator';
import { OrderType } from '../types/order.types';

export class CreateOrderDto {
  @ApiProperty({ enum: OrderType })
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty({ type: [Number] })
  @IsArray()
  menuItemsId: number[];

  @ApiProperty()
  @IsNumber()
  amount: number;
}
