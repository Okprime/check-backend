import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { RestaurantDTO } from './dto/restaurant.dto';

@ApiTags('restaurant')
@Controller('restaurant')
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
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
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
  findAll() {
    return plainToClass(RestaurantDTO, this.restaurantService.findAll());
  }

  @ApiOkResponse({
    description: 'Return one restaurant',
    type: RestaurantDTO,
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return plainToClass(RestaurantDTO, this.restaurantService.findOne(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(+id);
  }
}
