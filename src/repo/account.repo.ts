import { Injectable } from '@nestjs/common';
import { KyselyService } from '../db/db';
import { DB } from '../db/types';
import { sql, Transaction } from 'kysely';

@Injectable()
export class AccountRepo {
  constructor(private readonly client: KyselyService<DB>) { }

  async create(userId: string, trx?: Transaction<DB>) {
    const queryBuilder = trx
      ? trx.insertInto('Account')
      : this.client.insertInto('Account');
    return queryBuilder
      .values({ balance: '0', userId })
      .returning(['id', 'balance'])
      .executeTakeFirst();
  }
  async debitAccount({
    accountId,
    amount,
    trx,
  }: {
    accountId: string;
    amount: number;
    trx: Transaction<DB>;
  }) {
    return trx
      .updateTable('Account')
      .set({
        balance: sql`balance - ${amount}`,
      })
      .returning('balance')
      .where('id', '=', accountId)
      .executeTakeFirst();
  }

  async creditAccount({
    accountId,
    amount,
    trx,
  }: {
    accountId: string;
    amount: number;
    trx: Transaction<DB>;
  }) {
    return trx
      .updateTable('Account')
      .set({
        balance: sql`balance + ${amount}`,
      })
      .returning('balance')
      .where('id', '=', accountId)
      .executeTakeFirst();
  }

  async getAccountBalanceByUserId(userId: string, trx?: Transaction<DB>) {
    const queryBuilder = trx
      ? trx.selectFrom('Account')
      : this.client.selectFrom('Account');
    return queryBuilder
      .select(['balance', 'id'])
      .forUpdate()
      .where('userId', '=', userId)
      .executeTakeFirst();
  }
}
