import { TransactionStatus, TransactionType } from '@prisma/client';
export declare class CreateTransactionDto {
    description: string;
    amount: number;
    type: TransactionType;
    status?: TransactionStatus;
    date: string;
    dueDate?: string;
    categoryId: string;
}
export declare class UpdateTransactionDto {
    description?: string;
    amount?: number;
    type?: TransactionType;
    status?: TransactionStatus;
    date?: string;
    dueDate?: string;
    categoryId?: string;
}
export declare enum TransactionSortField {
    DATE = "date",
    AMOUNT = "amount",
    DESCRIPTION = "description",
    STATUS = "status"
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class QueryTransactionsDto {
    page?: number;
    limit?: number;
    type?: TransactionType;
    status?: TransactionStatus;
    categoryId?: string;
    categoryIds?: string[];
    from?: string;
    to?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    sortBy?: TransactionSortField;
    sortOrder?: SortOrder;
}
