import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';
import { CategoryService } from '../category/category.service';

describe('MenuService', () => {
  let service: MenuService;
  let restaurantService: RestaurantService;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(Menu),
          useClass: Repository,
        },
        {
          provide: RestaurantService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
