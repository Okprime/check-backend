import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../user/user.service';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';

describe('RestaurantService', () => {
  let service: RestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: getRepositoryToken(Restaurant),
          useClass: Repository,
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
