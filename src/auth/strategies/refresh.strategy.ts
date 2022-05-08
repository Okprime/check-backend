import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appConstant } from '../../common/constants/app.constant';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshtoken',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: appConstant.TOKENS.SECRET,
    });
  }

  async validate(payload: any) {
    const {
      email,
      firstName,
      lastName,
      phone,
      role,
      deviceToken,
      createdAt,
      updatedAt,
    } = payload;
    return {
      id: payload.sub,
      email,
      firstName,
      lastName,
      phoneNumber: phone,
      role,
      deviceToken,
      createdAt,
      updatedAt,
    };
  }
}
