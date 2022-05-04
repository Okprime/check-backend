import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { MenuPayload } from './types/menu.types';
import { CategoryService } from '../category/category.service';
import { GetMenuQueryParams } from './dto/get-menu-query-params.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    private restaurantService: RestaurantService,
    private categoryService: CategoryService,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const { restaurantId, categoryId } = createMenuDto;
    const restaurantDetails = await this.restaurantService.findOne(
      restaurantId,
    );

    const categoryDetails = await this.categoryService.findOne(categoryId);

    const payload: MenuPayload = {
      ...createMenuDto,
      restaurant: restaurantDetails,
      category: categoryDetails,
    };

    return this.menuRepository.save(payload);
  }

  findAll(queryParams: GetMenuQueryParams): Promise<Menu[]> {
    const { limit, offset } = queryParams;
    return this.menuRepository.find({
      relations: ['category'],
      where: {
        isAvailable: true,
      },
      order: {
        id: -1,
      },
      skip: offset,
      take: limit,
    });
  }

  findByIds(ids: number[]): Promise<Menu[]> {
    return this.menuRepository.findByIds(ids);
  }

  async findOne(id: number): Promise<Menu> {
    const result = await this.menuRepository.findOne({
      relations: ['category'],
      where: {
        id,
        isAvailable: true,
      },
    });

    if (result === undefined) throw new NotFoundException('Menu not found');

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
