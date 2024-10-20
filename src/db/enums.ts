export const TransactionType = {
    debit: "debit",
    credit: "credit"
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
export const TransactionStatus = {
    pending: "pending",
    failed: "failed",
    successful: "successful"
} as const;
export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];
