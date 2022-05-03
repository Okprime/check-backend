import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItemService } from '../order-item/order-item.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private orderItemService: OrderItemService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const { orderType, menuItemsId, amount } = createOrderDto;

    const orderItemDetails = await this.orderItemService.findByMenuIds(
      menuItemsId,
    );

    const payload = {
      orderType,
      amount,
      menuItems: orderItemDetails,
      user,
    };

    return this.orderRepository.save(payload);
  }

  async saveOrder(payload: any) {
    return this.orderRepository.save({ ...payload });
  }

  findAll() {
    return this.orderRepository.find();
  }

  findByIds(ids: number[]) {
    // handle if not found
    return this.orderRepository.findByIds(ids);
  }

  async findOne(id: number) {
    const result = await this.orderRepository.findOne(id);
    if (result === undefined) throw new NotFoundException('Order not found');

    return result;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.orderRepository.update(id, updateOrderDto);
    return 'Success';
  }

  remove(id: number) {
    return this.orderRepository.delete(id);
  }
}
