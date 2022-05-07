import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from '../order/order.service';
import { Repository } from 'typeorm';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { MenuService } from '../menu/menu.service';
import { OrderItemService } from '../order-item/order-item.service';
import { PushService } from '../common/services/push/push.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useClass: Repository,
        },
        {
          provide: OrderService,
          useValue: {
            saveOrder: jest.fn(),
            findByIds: jest.fn(),
          },
        },
        {
          provide: RestaurantService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: MenuService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: OrderItemService,
          useValue: {
            saveOrderItem: jest.fn(),
            findByMenuIds: jest.fn(),
          },
        },
        {
          provide: PushService,
          useValue: {
            sendPush: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
