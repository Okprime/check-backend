import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderService } from '../order/order.service';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private orderService: OrderService,
    private restaurantService: RestaurantService,
  ) {}

  async create(createCartDto: CreateCartDto, user: User) {
    const { restaurantId, table, totalAmount, ordersIds } = createCartDto;
    const orderDetails = await this.orderService.findByIds(ordersIds);
    const restaurantDetails = await this.restaurantService.findOne(
      restaurantId,
    );

    const cartPayload = {
      restaurant: restaurantDetails,
      table,
      totalAmount,
      orders: orderDetails,
      user,
    };

    return this.cartRepository.save(cartPayload);
  }

  // async createTest(createCartDtoTest: CreateCartDtoTest, user: User) {
  //   const payload = JSON.parse(createCartDtoTest.payload);

  //   const { restaurantId } = payload;

  //   const restaurantDetails = await this.restaurantService.findOne(
  //     restaurantId,
  //   );

  //   const cartPayload = {
  //     ...payload,
  //     user,
  //     restaurant: restaurantDetails,
  //   };

  //   await this.cartRepository.save(cartPayload);

  //   return 'Order successfully placed';
  // }

  findAll() {
    return this.cartRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
