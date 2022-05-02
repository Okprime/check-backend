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
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { RestaurantDTO } from './dto/restaurant.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../user/entities/user.entity';

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
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       image: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @AuthUser() user: User,
  ) {
    await this.handleRestriction(user);
    return plainToClass(
      RestaurantDTO,
      this.restaurantService.create(createRestaurantDto),
    );
  }

  @ApiOkResponse({
    description: 'Return all restaurants',
    type: [RestaurantDTO],
  })
  @Get()
  async findAll(@AuthUser() user: User) {
    await this.handleRestriction(user);
    return plainToClass(RestaurantDTO, this.restaurantService.findAll());
  }

  @ApiOkResponse({
    description: 'Return one restaurant',
    type: RestaurantDTO,
  })
  @Get(':id')
  async findOne(@Param('id') id: number, @AuthUser() user: User) {
    await this.handleRestriction(user);
    return plainToClass(RestaurantDTO, this.restaurantService.findOne(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @AuthUser() user: User,
  ) {
    await this.handleRestriction(user);
    return this.restaurantService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @AuthUser() user: User) {
    await this.handleRestriction(user);
    return this.restaurantService.remove(+id);
  }

  async handleRestriction(user: User) {
    if (user.role === 'user')
      throw new BadRequestException(
        'Sorry, only an admin can perform this action',
      );
  }
}
