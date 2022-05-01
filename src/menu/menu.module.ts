import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu } from './entities/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), RestaurantModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
