import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderService } from '../order/order.service';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { User } from '../user/entities/user.entity';
import { MenuService } from '../menu/menu.service';
import { OrderItemService } from '../order-item/order-item.service';
import { GetAllCartQueryParams } from './dto/get-all-cart-query-param.dto';
import { GetCartQueryParams } from './dto/get-cart-query-param.dto';

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

  async saveCart(payload: any) {
    return this.cartRepository.save({ ...payload });
  }

  async createCart(createCartDto: CreateCartDto, user: User) {
    const payload = JSON.parse(createCartDto.payload);

    const { restaurantId, orders, table, totalAmount } = payload;

    const restaurantDetails = await this.restaurantService.findOne(
      restaurantId,
    );

    const orderOrder = [];

    for (const order of orders) {
      const menuItemsId = [];
      const ordersIds = [];
      const ordeItemsIds = [];

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
        const orderItemDetail = await this.orderItemService.saveOrderItem(
          orderItemPayload,
        );
        ordeItemsIds.push(orderItemDetail.id);
      }

      const orderItemDetails = await this.orderItemService.findByMenuIds(
        menuItemsId,
        ordeItemsIds,
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
      orderOrder.push(...orderDetails);
    }

    const cartPayload = {
      restaurant: restaurantDetails,
      table,
      totalAmount,
      orders: orderOrder,
      user,
    };

    // save cart
    await this.cartRepository.save(cartPayload);
  }

  getAllCarts(queryParams: GetAllCartQueryParams) {
    const { limit, offset, status } = queryParams;
    return this.cartRepository.find({
      where: {
        status,
      },
      skip: offset,
      take: limit,
      order: {
        id: -1,
      },
    });
  }

  findOne(id: number) {
    return this.cartRepository.findOne(id);
  }

  getAllCartForAUser(user: User, queryParams: GetCartQueryParams) {
    const { limit, offset } = queryParams;
    return this.cartRepository.find({
      where: {
        user,
      },
      skip: offset,
      take: limit,
      order: {
        id: -1,
      },
    });
  }

  getAllCartForARestaurant(id: number, queryParams: GetCartQueryParams) {
    const { limit, offset } = queryParams;
    return this.cartRepository.find({
      where: {
        restaurant: id,
      },
      skip: offset,
      take: limit,
      order: {
        id: -1,
      },
    });
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    return this.cartRepository.update(id, updateCartDto);
  }

  remove(id: number) {
    return this.cartRepository.delete(id);
  }
}
