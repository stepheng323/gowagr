import { Injectable } from '@nestjs/common';
import { AuthUser, IServiceHelper, TransactionQuery } from 'src/types';
import { TransferDto } from './dto/transfer.dto';
import { TransactionRepo } from '../repo/transaction.repo';
import { AccountRepo } from '../repo/account.repo';
import { KyselyService } from '../db/db';
import { DB } from '../db/types';
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
    senderData: AuthUser,
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

    const transaction = await this.client.transaction().execute(async (trx) => {
      const sender = await this.userRepo.getUserAccountByUsername(
        senderData.username,
      );
      if (Number(sender.balance) < amount)
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
          userId: receiver.id,
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
          userId: sender.id,
          amount,
          balanceAfter: Number(debitedAccount.balance),
          balanceBefore: Number(sender.balance),
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
      message: 'Transfer initiated successfully',
      data: transaction,
    };
  }

  async getTransfers(
    user: AuthUser,
    filter: TransactionQuery,
  ): Promise<IServiceHelper> {
    const transactionHistory =
      await this.transactionRepo.fetchTransactionHistory(user.id, filter);
    return {
      status: 'successful',
      message: 'Transaction history fetched successfully',
      data: transactionHistory,
    };
  }
}
