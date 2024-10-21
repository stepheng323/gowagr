import { TransactionStatus, TransactionType } from 'src/db/enums';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionQuery extends PaginationParams {
  status: TransactionStatus;
  transactionType: TransactionType;
}

export interface PaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
