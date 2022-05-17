import { BadRequestException, Injectable } from '@nestjs/common';
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
import { PushService } from '../common/services/push/push.service';
import { CartStatus } from './types/cart.types';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private orderService: OrderService,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    private orderItemService: OrderItemService,
    private pushService: PushService,
  ) {}

  async saveCart(payload: any) {
    return this.cartRepository.save({ ...payload });
  }

  async createCart(createCartDto: CreateCartDto, user: User) {
    const payload = JSON.parse(createCartDto.payload);

    const { restaurantId, orders, table, totalAmount } = payload;

    const restaurantDetails =
      await this.restaurantService.findOneDependingOnUserRole(restaurantId);

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

    const managerToken = restaurantDetails.manager.deviceToken;

    // send push notification
    const pushPayload = {
      notification: {
        title: 'Order Alert',
        body: `${user.firstName} ${user.lastName} just placed an order from table ${table}`,
      },
      data: {
        btnName: 'Ok',
        btnAction: 'close',
      },
    };

    await this.pushService.sendPush(managerToken, pushPayload);
  }

  getAllCarts(queryParams: GetAllCartQueryParams) {
    const { offset = 0, limit = 10, status } = queryParams;
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
    return this.cartRepository.findOne({
      relations: ['user'],
      where: {
        id,
      },
    });
  }

  getAllCartForAUser(user: User, queryParams: GetCartQueryParams) {
    const { offset = 0, limit = 10 } = queryParams;
    return this.cartRepository.find({
      relations: ['restaurant'],
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
    const { offset = 0, limit = 10 } = queryParams;
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

  async updateCart(id: number, updateCartDto: UpdateCartDto) {
    const { status, userId } = updateCartDto;

    // get cart by id to get the user token
    const cartDetails = await this.findOne(id);

    if (status === CartStatus.PROCESSING) {
      // send push notification
      const pushPayload = {
        notification: {
          title: 'Order Processing Alert',
          body: `Hi ${cartDetails.user.firstName} ${cartDetails.user.lastName} Your tasty meal is being served. Please relax and stay on table ${cartDetails.table} while we put everything together for you☺️ `,
        },
        data: {
          btnName: 'Ok',
          btnAction: 'close',
        },
      };

      console.log('pushPayload-processing', pushPayload);

      await this.pushService.sendPush(
        cartDetails.user.deviceToken,
        pushPayload,
      );
      await this.cartRepository.update(id, { status });
    } else {
      const pushPayload = {
        // send push notification
        notification: {
          title: 'Your Order is on its way!',
          body: `Hi ${cartDetails.user.firstName} ${cartDetails.user.lastName} Your order is completed, we hope you had a fantastic experience today😜. Enjoy your meal!🥘 `,
        },
        data: {
          btnName: 'Ok',
          btnAction: 'close',
        },
      };

      console.log('pushPayload-completed', pushPayload);

      await this.pushService.sendPush(
        cartDetails.user.deviceToken,
        pushPayload,
      );

      if (userId !== cartDetails.user.id) {
        throw new BadRequestException('Sorry, wrong order');
      }
      await this.cartRepository.update(id, { status });
    }
  }

  remove(id: number) {
    return this.cartRepository.delete(id);
  }
}
