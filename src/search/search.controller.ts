import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MenuList } from '../menu/dto/menu.dto';
import { plainToClass } from 'class-transformer';
import { SearchDTO } from './dto/search.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@ApiTags('search')
@Controller('search')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('menu')
  searchMenu(@Query() { query, limit, offset }: SearchDTO) {
    return plainToClass(
      MenuList,
      this.searchService.searchMenu(query, limit, offset),
    );
  }
}
