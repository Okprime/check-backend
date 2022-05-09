import {
  Controller,
  UseGuards,
  Get,
  Res,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from './entities/user.entity';
import { StrippedUser } from './dto/stripped-user.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('users')
@Controller('user')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: 'Returns user own profile',
    type: StrippedUser,
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@AuthUser() user: User) {
    return plainToClass(StrippedUser, this.usersService.getUserById(user.id));
  }

  @ApiOkResponse({
    description: 'Returns a user by its own id',
    type: StrippedUser,
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string, @AuthUser() user: User) {
    await this.handleRestriction(user);
    return plainToClass(StrippedUser, this.usersService.getUserById(id));
  }

  async handleRestriction(user: User) {
    if (user.role === 'user')
      throw new BadRequestException(
        'Sorry, only an admin can perform this action',
      );
  }
}
