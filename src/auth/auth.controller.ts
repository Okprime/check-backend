import {
  Body,
  Controller,
  Request,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RefreshAuthGuard } from 'src/common/guards/refresh-auth.guard';
import { AuthUser, AuthUserData } from '../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth-login.dto';
import { OTPResponseDTO } from './dto/OTPResponse.dto';
import { OTPVerificationDTO } from './dto/OTPVerification.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    const result = await this.authService.login(req.user, loginDto);
    return result;
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: OTPResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Get('request-otp')
  async requestOtp(@AuthUser() user: User, @Res() res) {
    const { phoneNumber } = user;
    await this.authService.handleOTPRequest(phoneNumber);
    return res
      .status(200)
      .json({ message: 'An OTP has been sent to your phone', error: false });
  }

  @ApiBearerAuth()
  @Post('verify-otp')
  @UseGuards(JwtAuthGuard)
  async verifyOtp(
    @Body() otpVerification: OTPVerificationDTO,
    @AuthUser() user: User,
    @Res() res,
  ) {
    const { code } = otpVerification;
    const { phoneNumber } = user;
    await this.authService.handleOTPVerification(phoneNumber, code, user);
    return res
      .status(200)
      .json({ message: 'User has been verified', error: false });
  }

  @UseGuards(RefreshAuthGuard)
  @ApiBearerAuth()
  @Post('refresh')
  async refreshToken(
    @AuthUser() user: AuthUserData,
    @Body() body: RefreshTokenDto,
  ) {
    const { refreshToken } = body;
    return this.authService.refreshToken(user, refreshToken);
  }
}
