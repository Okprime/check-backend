import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  async registerAccount(@Body() createUserDto: CreateUserDto) {
    return this.accountService.registerAccount(createUserDto);
  }

  @Post('register/admin')
  async registerAdminAccount(@Body() createUserDto: CreateUserDto) {
    return this.accountService.registerAccount(createUserDto);
  }
}
