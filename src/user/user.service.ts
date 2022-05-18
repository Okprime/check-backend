import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import PhoneNumber from 'awesome-phonenumber';
import { UserPayload } from './types/user.types';

export interface PhoneDetails {
  countryCode: string;
  phoneNumber: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(payload) {
    return this.userRepository.save({
      ...payload,
    });
  }

  async getUserById(userId: string, relations?: string[]): Promise<User> {
    const user = await this.userRepository.findOne(
      { id: userId },
      { relations },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  getPhoneDetails(phone: string): PhoneDetails {
    const pn = new PhoneNumber(phone);
    const countryCode = pn.getCountryCode();
    const phoneNumber = pn.getNumber('significant');
    return { countryCode: `+${countryCode}`, phoneNumber };
  }

  async findByPhoneDetails({
    phoneNumber,
    countryCode,
  }: PhoneDetails): Promise<User> {
    return this.userRepository.findOne({ phoneNumber, countryCode });
  }

  async getUserWithPasswordInfo(id: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.hash')
      .addSelect('user.salt')
      .where('user.id = :id', { id })
      .getOne();
  }

  async updateUserProfile(id: string, userPayload: UserPayload) {
    await this.userRepository.update(id, userPayload);
    return 'Success';
  }

  async changePassword(id: string, hash: string, salt: string) {
    return this.userRepository.update({ id }, { hash, salt });
  }
}
