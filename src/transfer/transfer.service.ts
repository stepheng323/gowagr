import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { AuthUser, IServiceHelper, TransactionQuery } from 'src/types';
import { TransferDto } from './dto/transfer.dto';
import { TransactionRepo } from '../repo/transaction.repo';
import { AccountRepo } from '../repo/account.repo';
import { KyselyService } from '../db/db';
import { DB } from '../db/types';
import { UserRepo } from '../repo/userRepo';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TransferService {
  constructor(
    private readonly client: KyselyService<DB>,
    private transactionRepo: TransactionRepo,
    private accountRepo: AccountRepo,
    private userRepo: UserRepo,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Initiates a transfer between two users.
   *
   * This method attempts to transfer funds from the sender's account to the receiver's account.
   * It first checks if the receiver exists and if the transfer is not already in progress.
   * If the sender has sufficient funds, it debits the sender's account and credits the receiver's account.
   * It then records the transactions for both the sender and receiver.
   *
   * @param {AuthUser} senderData - The authenticated user initiating the transfer.
   * @param {TransferDto} transferDto - The transfer details including amount, receiver username, and optional note.
   * @returns {Promise<IServiceHelper>} A promise that resolves to an object indicating the status of the transfer.
   */
  async transfer(
    senderData: AuthUser,
    transferDto: TransferDto,
  ): Promise<IServiceHelper> {
    const { amount, note } = transferDto;
    const receiver = await this.userRepo.getUserAccountByUsername(
      transferDto.recieverUsername,
    );

    if (transferDto.recieverUsername === senderData.username) {
      return {
        status: 'bad-request',
        message: 'You cannot transfer funds to yourself',
      };
    }

    if (!receiver)
      return {
        status: 'not-found',
        message: 'Please enter a valid receiver username',
      };

    const transaction = await this.client.transaction().execute(async (trx) => {
      const cacheKey = `transfer-${senderData.username}-${transferDto.recieverUsername}-${amount}`;
      const cache = await this.cacheManager.get(cacheKey);
      if (cache) {
        return {
          status: 'bad-request',
          message: 'Transfer already in progress',
        };
      }
      const ONE_MINUTES_IN_MILLISECONDS = 1 * 60 * 1000;
      await this.cacheManager.set(cacheKey, true, ONE_MINUTES_IN_MILLISECONDS);

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
      const senderTransaction = await this.transactionRepo.create({
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

      // Purge the cache
      await this.cacheManager.del(cacheKey);
      return senderTransaction;
    });

    return {
      status: 'successful',
      message: 'Transfer initiated successfully',
      data: transaction,
    };
  }

  /**
   * Fetches the transaction history for a given user based on the provided filter.
   *
   * @param {AuthUser} user - The user for whom to fetch the transaction history.
   * @param {TransactionQuery} filter - The filter criteria for the transaction history.
   * @returns {Promise<IServiceHelper>} A promise that resolves to an IServiceHelper object containing the transaction history.
   */
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
