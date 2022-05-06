import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
  ) {}

  async handleCreatingTablesBasedOnNumber(
    noOfTables: number,
    restaurant: Restaurant,
  ) {
    const tableArray = [];

    let tableNumber = 1;

    for (let i = 0; i < noOfTables; i++) {
      const tablePayload = {
        restaurant,
        tableNumber: tableNumber++,
      };

      tableArray.push(tablePayload);
    }
    return this.tableRepository.save(tableArray);
  }

  async getTablesByAdmin(user: User, limit: number, skip: number) {
    return this.tableRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect('table.restaurant', 'restaurant')
      .leftJoinAndSelect('restaurant.manager', 'manager')
      .where('manager.id = :manager', { manager: user.id })
      .skip(limit)
      .take(skip)
      .orderBy('table.updatedAt', 'DESC')
      .getMany();
  }

  async getTableById(id: string) {
    return this.tableRepository.findOne({
      relations: ['restaurant'],
      where: {
        id,
      },
    });
  }
}
