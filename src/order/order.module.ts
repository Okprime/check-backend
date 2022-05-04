import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemModule } from '../order-item/order-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), OrderItemModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
