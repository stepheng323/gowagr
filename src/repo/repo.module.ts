import { Global, Module } from '@nestjs/common';
import { UserRepo } from './userRepo';
import { AccountRepo } from './account.repo';
import { TransactionRepo } from './transaction.repo';

@Global()
@Module({
  providers: [
    UserRepo,
    AccountRepo,
    TransactionRepo,
  ],
  exports: [UserRepo, AccountRepo, TransactionRepo],
})
export class RepositoriesModule {}
