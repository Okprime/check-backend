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
  UseInterceptors,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UploadedFile,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { UpdateMenuDto } from './dto/update-menu.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { MenuList } from './dto/menu.dto';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { AuthUser } from '../common/decorators/auth.decorator';
import { GetMenuQueryParams } from './dto/get-menu-query-params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';

@Injectable()
class FileExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.file['name'] = req.body.name;
    req.file['description'] = req.body.description;
    req.file['restaurantId'] = Number(req.body.restaurantId);
    req.file['categoryId'] = Number(req.body.categoryId);
    req.file['price'] = Number(req.body.price);
    return next.handle();
  }
}

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        restaurantId: { type: 'integer' },
        categoryId: { type: 'integer' },
        price: { type: 'price' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile('file') file, @AuthUser() user: User) {
    await this.handleRestriction(user);
    return plainToClass(MenuList, this.menuService.create(file));
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
