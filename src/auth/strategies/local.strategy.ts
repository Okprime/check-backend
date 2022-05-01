import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'emailOrPhone' });
  }

  async validate(emailOrPhone: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(emailOrPhone, password);
    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }
    return user;
  }
}
