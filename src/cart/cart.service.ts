import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderService } from '../order/order.service';
import { Repository } from 'typeorm';
import { CreateCartDto, CreateCartDtoTest } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { User } from '../user/entities/user.entity';
import { MenuService } from '../menu/menu.service';
import { OrderItemService } from '../order-item/order-item.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private orderService: OrderService,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    private orderItemService: OrderItemService,
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

  async saveCart(payload: any) {
    return this.cartRepository.save({ ...payload });
  }

  async createTest(createCartDtoTest: CreateCartDtoTest, user: User) {
    const payload = JSON.parse(createCartDtoTest.payload);

    const { restaurantId, orders, table, totalAmount } = payload;

    const restaurantDetails = await this.restaurantService.findOne(
      restaurantId,
    );

    const menuItemsId = [];
    const ordersIds = [];
    for (const order of orders) {
      const orderItems = order.items;
      for (const item of orderItems) {
        const menu = await this.menuService.findOne(item.menuId);
        menuItemsId.push(menu.id);

        const orderItemPayload = {
          user,
          menu,
          quantity: item.quantity,
        };

        // save menu items
        await this.orderItemService.saveOrderItem(orderItemPayload);
      }

      const orderItemDetails = await this.orderItemService.findByMenuIds(
        menuItemsId,
      );

      const orderPayload = {
        orderType: order.orderType,
        totalAmount: order.totalAmount,
        menuItems: orderItemDetails,
        user,
      };

      // save order
      const orderResult = await this.orderService.saveOrder(orderPayload);
      ordersIds.push(orderResult.id);

      const orderDetails = await this.orderService.findByIds(ordersIds);

      const cartPayload = {
        restaurant: restaurantDetails,
        table,
        totalAmount,
        orders: orderDetails,
        user,
      };

      // save cart
      await this.cartRepository.save(cartPayload);
    }
  }

  findAll() {
    return this.cartRepository.find();
  }

  findOne(id: number) {
    return this.cartRepository.findOne(id);
  }

  findByUser(user: User) {
    return this.cartRepository.find({
      where: {
        user,
      },
    });
  }

  findByRestaurant(id: number) {
    return this.cartRepository.find({
      where: {
        restaurant: id,
      },
    });
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
