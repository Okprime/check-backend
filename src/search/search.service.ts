import { Injectable } from '@nestjs/common';
import { MenuService } from '../menu/menu.service';

@Injectable()
export class SearchService {
  constructor(private menuService: MenuService) {}
  async searchMenu(
    restaurantId: number,
    query: string,
    limit = 10,
    offset = 0,
  ) {
    return this.menuService.searchMenu(restaurantId, query, limit, offset);
  }
}
