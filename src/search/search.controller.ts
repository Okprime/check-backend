import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { SearchDTO } from './dto/search.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { SearchMenuList } from './dto/search.menu.dto';

@ApiTags('search')
@Controller('search')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOkResponse({
    description: 'Return all menus by query',
    type: [SearchMenuList],
  })
  @Get('menu/:restaurantId')
  searchMenu(
    @Param('restaurantId') restaurantId: number,
    @Query() { query, limit, offset }: SearchDTO,
  ) {
    return plainToClass(
      SearchMenuList,
      this.searchService.searchMenu(restaurantId, query, limit, offset),
    );
  }
}
