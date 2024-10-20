import { Injectable } from '@nestjs/common';
import { IServiceHelper, PaginationParams, TransactionQuery } from 'src/types';
import { TransferDto } from './dto/transfer.dto';
import { TransactionRepo } from '../repo/transaction.repo';
import { AccountRepo } from '../repo/account.repo';
import { KyselyService } from '../db/db';
import { DB, User } from '../db/types';
import { UserRepo } from '../repo/userRepo';

@Injectable()
export class TransferService {
  constructor(
    private readonly client: KyselyService<DB>,
    private transactionRepo: TransactionRepo,
    private accountRepo: AccountRepo,
    private userRepo: UserRepo,
  ) {}

  async transfer(
    senderData: User,
    transferDto: TransferDto,
  ): Promise<IServiceHelper> {
    const { amount, note } = transferDto;
    const receiver = await this.userRepo.getUserAccountByUsername(
      transferDto.username,
    );

    if (!receiver)
      return {
        status: 'not-found',
        message: 'Please enter a valid receiver username',
      };

    const sender = await this.userRepo.getUserAccountByUsername(
      senderData.username,
    );

    const transaction = await this.client.transaction().execute(async (trx) => {
      const senderBalance = await this.accountRepo.getAccountBalance(
        sender.accountId,
        trx,
      );
      if (Number(senderBalance.balance) < amount)
        return {
          status: 'bad-request',
          message: 'Insufficient funds',
        };

      const debitedAccount = await this.accountRepo.debitAccount({
        accountId: sender.accountId,
        amount,
        trx,
      });
      const creditedAccount = await this.accountRepo.creditAccount({
        accountId: receiver.accountId,
        amount,
        trx,
      });

      // receiver transaction
      await this.transactionRepo.create({
        payload: {
          amount,
          balanceAfter: Number(creditedAccount.balance),
          balanceBefore: Number(creditedAccount.balance) - amount,
          senderAccountId: sender.accountId,
          receiverAccountId: receiver.accountId,
          type: 'credit',
          note,
        },
        trx,
      });

      //  sender transaction
      return this.transactionRepo.create({
        payload: {
          amount,
          balanceAfter: Number(debitedAccount.balance),
          balanceBefore: Number(senderBalance.balance),
          senderAccountId: sender.accountId,
          receiverAccountId: receiver.accountId,
          type: 'debit',
          note,
        },
        trx,
      });
    });

    return {
      status: 'successful',
      message: 'Transfer completed successfully',
      data: transaction,
    };
  }

  async getTransfers(
    user: User,
    filter: TransactionQuery,
  ): Promise<IServiceHelper> {
    const transactionHistory =
      await this.transactionRepo.fetchTransactionHistory('', filter);
    return {
      status: 'successful',
      message: 'Transaction history fetched successfully',
      data: transactionHistory,
    };
  }
}
