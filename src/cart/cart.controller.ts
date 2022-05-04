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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { GetAllCartQueryParams } from './dto/get-all-cart-query-param.dto';
import { GetCartQueryParams } from './dto/get-cart-query-param.dto';

@ApiTags('cart')
@Controller('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async createCart(
    @Body() createCartDto: CreateCartDto,
    @AuthUser() user: User,
    @Res() res,
  ) {
    await this.cartService.createCart(createCartDto, user);
    return res
      .status(200)
      .json({ message: 'Your Order has been placed', error: false });
  }

  @Get()
  async getAllCarts(
    @AuthUser() user: User,
    @Query() queryParams: GetAllCartQueryParams,
  ) {
    await this.handleRestriction(user);
    return this.cartService.getAllCarts(queryParams);
  }

  @Get('restaurant/:id')
  getAllCartForARestaurant(
    @Param('id', ParseIntPipe) id: number,
    @Query() queryParams: GetCartQueryParams,
  ) {
    return this.cartService.getAllCartForARestaurant(id, queryParams);
  }

  @Get('user')
  getAllCartForAUser(
    @AuthUser() user: User,
    @Query() queryParams: GetCartQueryParams,
  ) {
    return this.cartService.getAllCartForAUser(user, queryParams);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
    @AuthUser() user: User,
    @Res() res,
  ) {
    await this.handleRestriction(user);
    await this.cartService.update(id, updateCartDto);
    return res.status(200).json({
      message: 'This order has been marked as completed',
      error: false,
    });
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
