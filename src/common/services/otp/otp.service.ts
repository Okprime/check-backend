import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../../user/entities/user.entity';
import { UsersService } from '../../../user/user.service';
import { appConstant } from '../../constants/app.constant';
import { RedisService } from '../redis/redis.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class OTPService {
  constructor(
    private redisService: RedisService,
    private smsService: SmsService,
    private usersService: UsersService,
  ) {}

  async generatePhoneVerification(phone: string) {
    const code = this.getRandomPhoneCode();
    return await this.savePhoneVerification(phone, String(code));
  }

  async savePhoneVerification(phone: string, code: string) {
    await this.redisService.set(
      this.getPhoneVerificationKey(phone),
      String(code),
      appConstant.OTP.REDIS_DURATION,
    );
    return this.smsService.sendOTPViaHollaTags(phone, code);
  }

  async verifyPhone(phone: string, code: string, user: User) {
    const savedCode = await this.redisService.get(
      this.getPhoneVerificationKey(phone),
    );

    if (savedCode === null) {
      throw new BadRequestException('Code is invalid');
    }

    if (savedCode !== code) {
      throw new BadRequestException('Code does not match');
    }

    await Promise.all([
      await this.redisService.delete(this.getPhoneVerificationKey(phone)),
      await this.redisService.set(this.getVerifiedPhoneKey(phone), 'verified'),
      await this.usersService.updateUserProfile(user.id, { isVerified: true }),
    ]);
  }

  async checkIfPhoneIsVerified(phone: string): Promise<boolean> {
    const key = this.getVerifiedPhoneKey(phone);
    const res = await this.redisService.get(key);
    if (res) {
      await this.redisService.delete(key);
    }
    return !!res;
  }

  getRandomPhoneCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  getPhoneVerificationKey(phone: string) {
    return `PHONE-CODE#${phone}`;
  }

  getVerifiedPhoneKey(phone: string) {
    return `PHONE-VERIFIED#${phone}`;
  }

  maskPhone(phone: string): string {
    return `${phone.slice(0, 2)}${phone.slice(2).replace(/.(?=...)/g, '*')}`;
  }
}
