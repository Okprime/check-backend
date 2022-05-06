import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { Restaurant } from './entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../user/user.module';
import { Table } from './entities/table.entity';
import { TableService } from './table.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, Table]),
    UsersModule,
    CommonModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, TableService],
  exports: [RestaurantService, TableService],
})
export class RestaurantModule {}
