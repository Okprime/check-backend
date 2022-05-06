import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  NestInterceptor,
  Injectable,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { RestaurantDTO } from './dto/restaurant.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../user/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
// import { thss } from 'src/common/decorators/file.upload.decorator';

@Injectable()
class FileExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.file['name'] = req.body.name;
    req.file['address'] = req.body.address;
    req.file['city'] = req.body.city;
    req.file['managerEmail'] = req.body.managerEmail;
    req.file['noOfTables'] = Number(req.body.noOfTables);
    return next.handle();
  }
}

@ApiTags('restaurant')
@Controller('restaurant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOkResponse({
    description: 'Return created restaurant',
    type: RestaurantDTO,
  })
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        address: { type: 'string' },
        city: { type: 'string' },
        managerEmail: { type: 'string' },
        noOfTables: { type: 'integer' },
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
    return plainToClass(RestaurantDTO, this.restaurantService.create(file));
  }

  @ApiOkResponse({
    description: 'Return all restaurants',
    type: [RestaurantDTO],
  })
  @Get()
  async findAll() {
    return plainToClass(RestaurantDTO, this.restaurantService.findAll());
  }

  @ApiOkResponse({
    description: 'Return one restaurant',
    type: RestaurantDTO,
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return plainToClass(RestaurantDTO, this.restaurantService.findOne(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.restaurantService.remove(+id);
  }

  async handleRestriction(user: User) {
    if (user.role === 'user')
      throw new BadRequestException(
        'Sorry, only an admin can perform this action',
      );
  }
}
