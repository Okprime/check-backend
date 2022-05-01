import { Admin } from '../../user/entities/admin.entity';

export interface RestaurantPayload {
  name: string;
  image?: string;
  address: string;
  city: string;
  manager: Admin;
  noOfTables: number;
}
