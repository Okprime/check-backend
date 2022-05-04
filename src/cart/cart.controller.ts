import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CartService } from './cart.service';
import { CreateCartDto, CreateCartDtoTest } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('cart')
@Controller('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @AuthUser() user: User) {
    return this.cartService.create(createCartDto, user);
  }

  @Post('test')
  async createTest(
    @Body() createCartDtoTest: CreateCartDtoTest,
    @AuthUser() user: User,
    @Res() res,
  ) {
    await this.cartService.createTest(createCartDtoTest, user);
    return res
      .status(200)
      .json({ message: 'Your Order has been placed', error: false });
  }

  @Get()
  async findAll(@AuthUser() user: User) {
    await this.handleRestriction(user);
    return this.cartService.findAll();
  }

  @Get('restaurant/:id')
  findByRestaurant(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findByRestaurant(id);
  }

  @Get('user')
  findByUser(@AuthUser() user: User) {
    return this.cartService.findByUser(user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(+id);
  }

  async handleRestriction(user: User) {
    if (user.role === 'user')
      throw new BadRequestException(
        'Sorry, only an admin can perform this action',
      );
  }
}
