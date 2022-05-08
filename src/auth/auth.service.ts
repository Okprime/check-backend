import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { PhoneDetails, UsersService } from '../user/user.service';
import { appConstant } from '../common/constants/app.constant';
import { comparePassword } from '../common/utils/crypto';

import validator from 'validator';
import { RedisService } from '../common/services/redis/redis.service';
import { OTPService } from '../common/services/otp/otp.service';
import PhoneNumber from 'awesome-phonenumber';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private otpService: OTPService,
  ) {}

  async login(user: any, loginDto?: any) {
    const { deviceToken } = loginDto;
    const payload = {
      sub: user.id,
      email: user.email,
      phone: `${user.countryCode}${user.phoneNumber}`,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deviceToken: user.deviceToken,
    };

    if (deviceToken) {
      await this.usersService.updateUserProfile(user.id, { deviceToken });
    }

    // Make refresh token
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: appConstant.TOKENS.REFRESH.JWT_DURATION,
    });
    // Store refresh token in redis with expire time
    await this.redisService.set(
      refreshToken,
      refreshToken,
      appConstant.TOKENS.REFRESH.REDIS_DURATION,
    );

    return {
      access_token: this.jwtService.sign(payload),
      refreshToken,
    };
  }

  async validateUser(emailOrPhone: string, password: string): Promise<any> {
    const isEmail = validator.isEmail(emailOrPhone);

    let user: User | null = null;
    if (isEmail) {
      user = await this.usersService.findByEmail(emailOrPhone);
    } else {
      const phoneDetails = this.usersService.getPhoneDetails(emailOrPhone);
      user = await this.usersService.findByPhoneDetails(phoneDetails);
    }

    if (user) {
      const userWithPasswordInfo =
        await this.usersService.getUserWithPasswordInfo(user.id);
      if (!userWithPasswordInfo?.hash) {
        return null;
      }
      // decrypt password
      const isMatch = await comparePassword(
        password.toString(),
        userWithPasswordInfo.hash.toString(),
      );
      if (isMatch) {
        return user;
      }
      return null;
    }
    return null;
  }

  async handleOTPVerification(phoneNumber: string, code: string, user: User) {
    return this.otpService.verifyPhone(phoneNumber, code, user);
  }

  async handleOTPRequest(phone: string) {
    return this.otpService.generatePhoneVerification(phone);
  }

  getPhoneDetails(phone: string): PhoneDetails {
    const pn = new PhoneNumber(phone);
    const countryCode = pn.getCountryCode();
    const phoneNumber = pn.getNumber('significant');
    return { countryCode: `+${countryCode}`, phoneNumber };
  }

  async refreshToken(user, token) {
    const refreshToken = await this.redisService.get(token);

    if (!refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }
    const decoded = this.jwtService.decode(refreshToken);

    if (decoded.sub !== user.id) {
      await this.redisService.delete(refreshToken);
      throw new UnauthorizedException();
    }
    await this.redisService.delete(refreshToken);
    return this.login(user, user.deviceToken);
  }
}
