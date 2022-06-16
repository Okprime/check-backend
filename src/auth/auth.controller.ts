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
import { JwtOptionalAuthGuard } from '../common/guards/jwt-optional.guard';
import { RefreshAuthGuard } from '../common/guards/refresh-auth.guard';
import { AuthUser } from '../common/decorators/auth.decorator';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth-login.dto';
import { OTPVerificationDTO } from './dto/OTPVerification.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { OTPRequestDTO } from './dto/OTPRequest.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
// import { JwtAuthGuard } from '../common/guards/jwt.guard';

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
  @UseGuards(JwtOptionalAuthGuard)
  @Post('request-otp')
  async requestOtp(
    @Res() res,
    @Body() otpRequestDTO: OTPRequestDTO,
    @AuthUser() user?: User,
  ) {
    const { phone } = otpRequestDTO;
    (await user)
      ? await this.authService.handleOTPRequest(user.phoneNumber)
      : await this.authService.handleOTPRequest(phone);
    return res
      .status(200)
      .json({ message: 'An OTP has been sent to your phone', error: false });
  }

  @ApiBearerAuth()
  @Post('verify-otp')
  @UseGuards(JwtOptionalAuthGuard)
  async verifyOtp(
    @Body() otpVerification: OTPVerificationDTO,
    @Res() res,
    @AuthUser() user?: User,
  ) {
    const { code, phone } = otpVerification;
    (await user)
      ? await this.authService.handleOTPVerification(
          user.phoneNumber,
          code,
          user,
        )
      : await this.authService.handleOTPVerification(phone, code);
    return res
      .status(200)
      .json({ message: 'User has been verified', error: false });
  }

  @UseGuards(RefreshAuthGuard)
  @ApiBearerAuth()
  @Post('refresh')
  async refreshToken(@AuthUser() user: User, @Body() body: RefreshTokenDto) {
    const { refreshToken } = body;
    return this.authService.refreshToken(user, refreshToken);
  }

  @ApiOkResponse({
    description: 'Needs previous phone verification',
    status: 201,
  })
  @Post('password-reset')
  async passwordReset(
    @Body() { phone, password }: PasswordResetDto,
    @Res() res,
  ) {
    await this.authService.resetPassword(phone, password);
    return res
      .status(200)
      .json({ message: 'Your password has been reset', error: false });
  }

  // @ApiOkResponse({
  //   description: 'Logs a user out',
  //   status: 201,
  // })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('logout')
  // async logout(@AuthUser() user: User, @Res() res) {
  //   await this.authService.logout(user);
  //   return res.status(200).json({ message: 'Success', error: false });
  // }
}
