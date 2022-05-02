import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CategoryService } from './category.service';
import { CategoryDTO } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOkResponse({
    description: 'Return created menu',
    type: CategoryDTO,
  })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return plainToClass(
      CategoryDTO,
      this.categoryService.create(createCategoryDto),
    );
  }

  @ApiOkResponse({
    description: 'Return created menu',
    type: [CategoryDTO],
  })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOkResponse({
    description: 'Return created menu',
    type: CategoryDTO,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
