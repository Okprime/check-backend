import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDTO } from '../../common/dto/pagination.dto';
import { CartStatus } from '../types/cart.types';

export class GetAllCartQueryParams extends PaginationDTO {
  @ApiPropertyOptional({ default: CartStatus.PENDING })
  @IsOptional()
  @IsEnum(CartStatus)
  status: CartStatus;
}
