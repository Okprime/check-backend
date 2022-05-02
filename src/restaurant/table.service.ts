import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../user/user.service';
import { Table } from './entities/table.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    private usersService: UsersService,
  ) {}
  async create(payload) {
    return this.tableRepository.save(payload);
  }

  async handleCreatingTablesBasedOnNumber(noOfTables: number) {
    //
  }
}
