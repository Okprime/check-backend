import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { MenuList } from './dto/menu.dto';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOkResponse({
    description: 'Return created menu',
    type: MenuList,
  })
  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return plainToClass(MenuList, this.menuService.create(createMenuDto));
  }

  @ApiOkResponse({
    description: 'Return all menus',
    type: [MenuList],
  })
  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @ApiOkResponse({
    description: 'Return a particular menu',
    type: MenuList,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.menuService.remove(id);
  }
}
