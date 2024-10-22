import { Injectable } from '@nestjs/common';
import { KyselyService } from '../db/db';
import { DB, Transaction as TransactionHistory } from '../db/types';
import { Transaction } from 'kysely';
import { TransactionData, TransactionQuery } from '../types';
import { paginate } from '../utils/pagination';

@Injectable()
export class TransactionRepo {
  constructor(private readonly client: KyselyService<DB>) { }

  async create({
    payload,
    trx,
  }: {
    payload: TransactionData;
    trx: Transaction<DB>;
  }) {
    const { amount, balanceBefore, balanceAfter } = payload;
    return trx
      .insertInto('Transaction')
      .values({
        ...payload,
        amount: amount.toString(),
        balanceBefore: balanceBefore.toString(),
        balanceAfter: balanceAfter.toString(),
      })
      .returningAll()
      .executeTakeFirst();
  }

  async fetchTransactionHistory(userId: string, filter: TransactionQuery) {
    let query = this.client.selectFrom('Transaction').selectAll();

    query = query.where('userId', '=', userId);

    if (filter.status) {
      query = query.where('Transaction.status', '=', filter.status);
    }

    if (filter.sortBy === 'date') {
      query = query.orderBy('Transaction.createdAt', filter.sortOrder);
    }

    if (filter.transactionType) {
      query = query.where('Transaction.type', '=', filter.transactionType);
    }

    return paginate<TransactionHistory>({
      queryBuilder: query,
      pagination: filter,
      identifier: 'Transaction.id',
    });
  }
}
