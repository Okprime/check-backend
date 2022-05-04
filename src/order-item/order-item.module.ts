import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItem } from './entities/order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem]), MenuModule],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
