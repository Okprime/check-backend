import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { OTPService } from './services/otp/otp.service';
import { RedisService } from './services/redis/redis.service';
import { SmsService } from './services/sms/sms.service';
import { UsersModule } from '../user/user.module';
import { S3Service } from './services/s3/s3.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    UsersModule,
  ],
  providers: [RedisService, ConfigService, OTPService, SmsService, S3Service],
  exports: [RedisService, ConfigService, OTPService, SmsService, S3Service],
})
export class CommonModule {}
