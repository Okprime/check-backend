import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantPayload } from './types/restaurant.types';
import { UsersService } from '../user/user.service';
import { TableService } from './table.service';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private usersService: UsersService,
    private tableService: TableService,
  ) {}
  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const { managerEmail, noOfTables } = createRestaurantDto;

    const managerDetails = await this.usersService.findByEmail(managerEmail);

    const payload: RestaurantPayload = {
      ...createRestaurantDto,
      manager: managerDetails,
    };

    const restautantDetails = await this.restaurantRepository.save(payload);

    await this.tableService.handleCreatingTablesBasedOnNumber(
      noOfTables,
      restautantDetails,
    );

    return restautantDetails;
  }

  findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: {
        isDeleted: false,
      },
      order: {
        id: -1,
      },
    });
  }

  async findOne(id: number): Promise<Restaurant> {
    const result = await this.restaurantRepository.findOne({
      relations: ['menu'],
      where: {
        id,
        isDeleted: false,
      },
    });

    if (result === undefined)
      throw new NotFoundException('Restaurant not found');

    return result;
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    await this.restaurantRepository.update(id, updateRestaurantDto);
    return 'Success';
  }

  async remove(id: number) {
    await this.restaurantRepository.update(id, { isDeleted: true });
    return 'Success';
  }
}
