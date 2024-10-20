import { TransactionType } from 'src/db/enums';

export interface TransactionData {
  senderAccountId: string;
  receiverAccountId: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  type: TransactionType;
  metadata?: string;
  note?: string;
}

