import { User } from '../../user/entities/user.entity';

export interface RestaurantPayload {
  name: string;
  image?: string;
  address: string;
  city: string;
  manager: User;
  noOfTables: number;
}
