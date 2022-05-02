import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { appConstant } from '../common/constants/app.constant';
import { User } from '../user/entities/user.entity';
import { hashPassword } from '../common/utils/crypto';
import { CreateUser } from '../user/types/user.types';

@Injectable()
export class AccountService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
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

    const user = await this.usersService.create({
      ...createPayload,
      salt,
      hash,
      role,
    });

    // send otp verification
    // await this.authService.handleOTPRequest(
    //   `${phoneDetails.countryCode}${phoneNumber}`,
    // );

    return this.authService.login(user);
  }
}
