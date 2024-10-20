import { Injectable } from '@nestjs/common';
import { KyselyService } from '../db/db';
import { DB, Transaction as TransactionHistory } from '../db/types';
import { Transaction } from 'kysely';
import { TransactionData, TransactionQuery } from '../types';
import { paginate } from 'src/utils/pagination';

@Injectable()
export class TransactionRepo {
  constructor(private readonly client: KyselyService<DB>) {}

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

    if (filter.status) {
      query = query.where('Transaction.status', '=', filter.status);
    }

    if (filter.sortBy === 'amount') {
      query = query.orderBy('Transaction.amount', filter.sortOrder);
    }

    if (filter.status) {
      query = query.where('Transaction.status', '=', filter.status);
    }
    // query.where('')

    return paginate<TransactionHistory>({
      queryBuilder: query,
      pagination: filter,
      identifier: 'Order.id',
    });
  }
}
