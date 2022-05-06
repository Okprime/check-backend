import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { Restaurant } from './entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../user/user.module';

import { CommonModule } from '../common/common.module';
import { TableModule } from '../table/table.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant]),
    UsersModule,
    CommonModule,
    TableModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
