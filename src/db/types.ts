import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { TransactionType, TransactionStatus } from "./enums";

export type Account = {
    id: Generated<string>;
    userId: string;
    balance: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp | null;
};
export type Transaction = {
    id: Generated<string>;
    userId: string;
    senderAccountId: string;
    receiverAccountId: string;
    type: TransactionType;
    status: Generated<TransactionStatus>;
    reference: Generated<string>;
    metadata: string | null;
    amount: string;
    balanceBefore: string;
    balanceAfter: string;
    note: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp | null;
};
export type User = {
    id: Generated<string>;
    email: string;
    password: string;
    username: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp | null;
};
export type DB = {
    Account: Account;
    Transaction: Transaction;
    User: User;
};
