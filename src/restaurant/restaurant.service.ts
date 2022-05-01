import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminService } from '../user/admin.service';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantPayload } from './types/restaurant.types';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private adminService: AdminService,
  ) {}
  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const { managerEmail } = createRestaurantDto;

    const managerDetails = await this.adminService.findByEmail(managerEmail);

    const payload: RestaurantPayload = {
      ...createRestaurantDto,
      manager: managerDetails,
    };
    return this.restaurantRepository.save(payload);
  }

  findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: {
        isDeleted: false,
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
