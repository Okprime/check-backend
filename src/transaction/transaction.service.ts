/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { nanoid } from 'nanoid';
import { TransactionStatus, TransactionType } from './types/transaction.types';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UsersService } from '../user/user.service';
import { PushService } from '../common/services/push/push.service';
import { VerifyTransferDto } from './dto/verify-transaction.dto';

const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(
  `${process.env.FLUTTERWAVE_PUBLIC_KEY}`,
  `${process.env.FLUTTERWAVE_SECRET}`,
);

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private usersService: UsersService,
    private pushService: PushService,
  ) {}
  async saveDeposit(createTransactionDto: CreateTransactionDto, user: User) {
    const transactionRef = `transRefId-${nanoid(10)}`;
    return this.transactionRepository.save({
      ...createTransactionDto,
      user,
      transactionRef,
      transactionType: TransactionType.DEPOSIT,
    });
  }

  async transferFundsWithinAccounts(
    createTransferDto: CreateTransferDto,
    transferFrom: User,
  ) {
    const { transferToId, amount } = createTransferDto;
    const transferToDetails = await this.usersService.findByJustPhoneNumber(
      transferToId,
    );
    const transactionRef = `transRefId-${nanoid(10)}`;

    if (transferFrom.balance < amount) {
      throw new BadRequestException('Insufficient fund');
    }

    const pushPayload = {
      // send push notification
      notification: {
        title: 'Wallet funded!',
        body: `Hi ${transferToDetails.firstName}, your wallet has been funded with ${amount} naira`,
      },
      data: {
        btnName: 'Ok',
        btnAction: 'close',
      },
    };

    console.log('pushPayload-transfer', pushPayload);

    return await getManager().transaction(
      async (transactionalEntityManager) => {
        const updateDecrementResult =
          await transactionalEntityManager.decrement(
            User,
            { id: transferFrom.id },
            'balance',
            amount,
          );
        if (updateDecrementResult)
          transferToDetails.balance = transferToDetails.balance + amount;

        const updateIncrementResult =
          await transactionalEntityManager.increment(
            User,
            { id: transferToDetails.id },
            'balance',
            amount,
          );
        if (updateIncrementResult)
          transferFrom.balance = transferFrom.balance - amount;

        await this.pushService.sendPush(
          transferToDetails.deviceToken,
          pushPayload,
        );

        return transactionalEntityManager.save(Transaction, {
          transferTo: transferToDetails,
          transferFrom,
          transactionRef,
          transactionType: TransactionType.TRANSFER,
          transactionStatus: TransactionStatus.SUCCESS,
          amount,
        });
      },
    );
  }

  async verifyTransactionRef(verifyTransferDto: VerifyTransferDto, user: User) {
    try {
      const { transactionRef } = verifyTransferDto;
      const payload = { id: transactionRef };
      const response = await flw.Transaction.verify(payload);
      console.log('verification response', response);

      if (response.status === 'success') {
        return Promise.all([
          await this.usersService.updateUserProfile(user.id, {
            balance: response.data.amount,
          }),
          await this.transactionRepository.update(
            { transactionRef },
            { transactionStatus: TransactionStatus.SUCCESS },
          ),
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
