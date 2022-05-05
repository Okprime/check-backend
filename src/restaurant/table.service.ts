import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Table } from './entities/table.entity';

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
    const tablePayload = {
      restaurant,
    };

    for (let i = 0; i < noOfTables; i++) {
      const result = await this.tableRepository.save(tablePayload);
      console.log('result', result);
    }
  }
}
