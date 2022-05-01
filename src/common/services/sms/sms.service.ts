import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(private httpService: HttpService) {}

  async sendOTPViaHollaTags(phoneNumber: string, otp: string) {
    try {
      const response = await firstValueFrom(
        await this.httpService
          .get(`${process.env.HOLLATAG_URL}`, {
            params: {
              user: process.env.HOLLATAG_USERNAME,
              pass: process.env.HOLLATAG_PASSWORD,
              from: 'CHECK',
              to: phoneNumber,
              msg: `Dear Customer, Please use this OTP ${otp} to complete your enrollment on Check. Do not disclose this OTP to anyone. It expires in 120 seconds.`,
              // callback_url: process.env.HOLLATAG_CALLBACK_URL,
              enable_msg_id: true,
            },
          })
          .pipe(map((response) => response.data)),
      );
      console.log('response', response);
    } catch (error) {
      console.log('error', error);
    }
  }
}
