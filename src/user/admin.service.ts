import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

export interface PhoneDetails {
  countryCode: string;
  phoneNumber: string;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(payload) {
    return this.adminRepository.save({
      ...payload,
    });
  }

  async findByEmail(email: string): Promise<Admin> {
    return await this.adminRepository.findOne({
      where: {
        email: email,
      },
    });
  }
}
