import {
  Controller,
  Get,
  Param,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { TableService } from './table.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../user/entities/user.entity';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { plainToClass } from 'class-transformer';
import { TableDTO } from './dto/table.dto';

@ApiTags('table')
@Controller('table')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @ApiOkResponse({
    description: 'Get all tables for a restaurant',
    type: [TableDTO],
  })
  @Get('restaurant')
  async getTablesByAdmin(
    @AuthUser() user: User,
    @Query() queryParams: PaginationDTO,
  ) {
    await this.handleRestriction(user);
    const { offset = 0, limit = 10 } = queryParams;
    return plainToClass(
      TableDTO,
      this.tableService.getTablesByAdmin(user, offset, limit),
    );
  }

  @ApiOkResponse({
    description: 'Returns a table by id',
    type: TableDTO,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return plainToClass(TableDTO, this.tableService.getTableById(id));
  }

  async handleRestriction(user: User) {
    if (user.role === 'user')
      throw new BadRequestException(
        'Sorry, only an admin can perform this action',
      );
  }
}
