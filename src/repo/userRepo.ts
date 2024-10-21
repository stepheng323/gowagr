import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { KyselyService } from '../db/db';
import { DB } from '../db/types';
import { Transaction } from 'kysely';

@Injectable()
export class UserRepo {
  constructor(private readonly client: KyselyService<DB>) {}

  async create(user: CreateUserDto, trx?: Transaction<DB>) {
    const queryBuilder = trx
      ? trx.insertInto('User')
      : this.client.insertInto('User');
    return queryBuilder
      .values(user)
      .returning(['id', 'email', 'username', 'createdAt'])
      .executeTakeFirst();
  }

  async findByEmail(email: string) {
    return this.client
      .selectFrom('User')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async findByUsername(username: string) {
    return this.client
      .selectFrom('User')
      .select(['id', 'email', 'username'])
      .where('username', '=', username)
      .executeTakeFirst();
  }

  async findByEmailOrUsername(email: string, username: string) {
    return this.client
      .selectFrom('User')
      .selectAll()
      .where((eb) =>
        eb.or([eb('email', '=', email), eb('username', '=', username)]),
      )
      .executeTakeFirst();
  }

  async getUserAccountByUsername(username: string) {
    return this.client
      .selectFrom('User')
      .innerJoin('Account', 'Account.userId', 'User.id')
      .select(['User.id', 'Account.balance', 'Account.id as accountId'])
      .where('username', '=', username)
      .executeTakeFirst();
  }
}
