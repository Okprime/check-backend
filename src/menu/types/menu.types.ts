import { Category } from '../../category/entities/category.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

export interface MenuPayload {
  name: string;
  description?: string;
  category: Category;
  price: number;
  restaurant: Restaurant;
}
