import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { appConstant } from '../common/constants/app.constant';
import { User } from '../user/entities/user.entity';
import { hashPassword } from '../common/utils/crypto';
import { CreateUser } from '../user/types/user.types';
import { AdminService } from '../user/admin.service';

@Injectable()
export class AccountService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private adminService: AdminService,
  ) {}

  async registerAccount(
    payload: Pick<User, 'firstName' | 'lastName' | 'email'> & {
      password?: string;
      phoneNumber?: string;
      role?: string;
    },
  ) {
    const { email, phoneNumber, password, role } = payload;

    let existingUser: User;

    try {
      existingUser = await this.usersService.findByEmail(email);
    } catch (error) {}

    if (existingUser) {
      throw new BadRequestException('Email already exist');
    }

    const phoneDetails = this.usersService.getPhoneDetails(phoneNumber);
    const createPayload: CreateUser = {
      ...payload,
      ...phoneDetails,
    };

    const regularExpression = appConstant.REGEX.PASSWORD;

    if (!regularExpression.test(password)) {
      throw new BadRequestException('Invalid password format');
    }
    const { salt, hash } = await hashPassword(password);

    if (role === 'admin') {
      return this.saveAdminAccount(createPayload, salt, hash);
    } else {
      return this.saveUserAccount(createPayload, salt, hash);
    }
  }

  async saveUserAccount(createPayload: CreateUser, salt: string, hash: string) {
    const { countryCode, phoneNumber } = createPayload;
    const user = await this.usersService.create({
      ...createPayload,
      salt,
      hash,
    });

    // // send otp verification
    await this.authService.handleOTPRequest(`${countryCode}${phoneNumber}`);

    return this.authService.login(user);
  }

  async saveAdminAccount(
    createPayload: CreateUser,
    salt: string,
    hash: string,
  ) {
    const { phoneNumber } = createPayload;
    const user = await this.adminService.create({
      ...createPayload,
      salt,
      hash,
    });

    // send otp verification
    await this.authService.handleOTPRequest(phoneNumber);

    return this.authService.login(user);
  }
}
