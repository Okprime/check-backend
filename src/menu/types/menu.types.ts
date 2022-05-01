import { Restaurant } from '../../restaurant/entities/restaurant.entity';

export interface MenuPayload {
  name: string;
  description?: string;
  category: string;
  price: number;
  restaurant: Restaurant;
}
