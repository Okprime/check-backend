import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../user/entities/user.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { VerifyTransferDto } from './dto/verify-transaction.dto';

@ApiTags('transaction')
@Controller('transaction')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  saveDeposit(
    @Body() createTransactionDto: CreateTransactionDto,
    @AuthUser() user: User,
  ) {
    return this.transactionService.saveDeposit(createTransactionDto, user);
  }

  @Post('transfer')
  transferFundsWithinAccounts(
    @Body() createTransferDto: CreateTransferDto,
    @AuthUser() user: User,
  ) {
    return this.transactionService.transferFundsWithinAccounts(
      createTransferDto,
      user,
    );
  }

  @Post('verify')
  verifyTransctionRef(@Body() verifyTransferDto: VerifyTransferDto) {
    return this.transactionService.verifyTransactionRef(verifyTransferDto);
  }
}
