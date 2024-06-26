import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../order/order.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { MenuModule } from '../menu/menu.module';
import { OrderItemModule } from '../order-item/order-item.module';
import { CommonModule } from '../common/common.module';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    OrderModule,
    RestaurantModule,
    MenuModule,
    OrderItemModule,
    CommonModule,
    UsersModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
