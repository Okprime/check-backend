import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuService } from '../menu/menu.service';
import { User } from '../user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private menuService: MenuService,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto, user: User) {
    const { menuId, totalAmount, quantity } = createOrderItemDto;
    const menu = await this.menuService.findOne(menuId);

    const orderItemPayload = {
      user,
      menu,
      totalAmount,
      quantity,
    };

    return this.orderItemRepository.save(orderItemPayload);
  }

  async saveOrderItem(payload: any) {
    return this.orderItemRepository.save({ ...payload });
  }

  findByMenuIds(ids: number[]) {
    return this.orderItemRepository.find({
      relations: ['menu'],
      where: {
        menu: In(ids),
      },
    });
  }

  findAll() {
    return this.orderItemRepository.find({
      relations: ['menu'],
    });
  }

  findOne(id: number) {
    return this.orderItemRepository.findOne(id);
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return this.orderItemRepository.update(id, updateOrderItemDto);
  }

  async remove(id: number) {
    return this.orderItemRepository.delete(id);
  }
}
