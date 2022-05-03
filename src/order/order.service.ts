import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { MenuService } from 'src/menu/menu.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private menuService: MenuService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const { orderType, menuItemsId, amount } = createOrderDto;

    const menuItemDetails = await this.menuService.findByIds(menuItemsId);

    const payload = {
      orderType,
      amount,
      menuItems: menuItemDetails,
      user,
    };

    return this.orderRepository.save(payload);
  }

  findAll() {
    return this.orderRepository.find();
  }

  findByIds(ids: number[]) {
    // handle if not found
    return this.orderRepository.findByIds(ids);
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
