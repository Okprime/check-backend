import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { MenuPayload } from './types/menu.types';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    private restaurantService: RestaurantService,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const { restaurantId } = createMenuDto;
    const restaurantDetails = await this.restaurantService.findOne(
      restaurantId,
    );

    const payload: MenuPayload = {
      ...createMenuDto,
      restaurant: restaurantDetails,
    };

    return this.menuRepository.save(payload);
  }

  findAll(): Promise<Menu[]> {
    return this.menuRepository.find({
      where: {
        isAvailable: true,
      },
    });
  }

  async findOne(id: number): Promise<Menu> {
    const result = await this.menuRepository.findOne({
      where: {
        id,
        isAvailable: true,
      },
    });

    if (result === undefined)
      throw new NotFoundException('Restaurant not found');

    return result;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    await this.menuRepository.update(id, updateMenuDto);
    return 'Success';
  }

  async remove(id: number) {
    await this.menuRepository.delete(id);
    return 'Success';
  }
}
