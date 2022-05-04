import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { MenuList } from './dto/menu.dto';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { AuthUser } from '../common/decorators/auth.decorator';
import { GetMenuQueryParams } from './dto/get-menu-query-params.dto';

@ApiTags('menu')
@Controller('menu')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOkResponse({
    description: 'Return created menu',
    type: MenuList,
  })
  @Post()
  async create(@Body() createMenuDto: CreateMenuDto, @AuthUser() user: User) {
    await this.handleRestriction(user);
    return plainToClass(MenuList, this.menuService.create(createMenuDto));
  }

  @ApiOkResponse({
    description: 'Return all menus',
    type: [MenuList],
  })
  @Get()
  async findAll(@Query() queryParams: GetMenuQueryParams) {
    return plainToClass(MenuList, this.menuService.findAll(queryParams));
  }

  @ApiOkResponse({
    description: 'Return a particular menu',
    type: MenuList,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return plainToClass(MenuList, this.menuService.findOne(+id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.menuService.remove(id);
  }

  async handleRestriction(user: User) {
    if (user.role === 'user')
      throw new BadRequestException(
        'Sorry, only an admin can perform this action',
      );
  }
}
