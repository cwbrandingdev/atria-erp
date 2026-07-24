import { Contract, Client, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateTransactionDto, QueryTransactionsDto, UpdateTransactionDto } from './dto/transaction.dto';
import { QueryFinanceDto } from './dto/query-finance.dto';
type FinancePeriodOptions = Pick<QueryFinanceDto, 'month' | 'year'>;
export declare class FinanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCategories(type?: TransactionType): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        color: string;
        type: import("@prisma/client").$Enums.TransactionType;
    }[]>;
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        color: string;
        type: import("@prisma/client").$Enums.TransactionType;
    }>;
    updateCategory(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        color: string;
        type: import("@prisma/client").$Enums.TransactionType;
    }>;
    deleteCategory(id: string): Promise<void>;
    getCashFlow(userId: string, period?: FinancePeriodOptions): Promise<{
        totalRevenue: number;
        totalExpenses: number;
        netProfit: number;
        profitMargin: number;
        pendingReceivables: number;
        pendingPayables: number;
        monthlyCashFlow: {
            month: string;
            income: number;
            expense: number;
        }[];
        expenseByCategory: {
            categoryId: string;
            categoryName: string;
            amount: number;
            color: string;
        }[];
        period: {
            month: number | null;
            year: number;
        };
    }>;
    getOverview(userId: string, period?: FinancePeriodOptions): Promise<{
        recentTransactions: {
            id: string;
            description: string;
            amount: number;
            type: "income" | "expense";
            status: "paid" | "pending" | "overdue";
            date: string;
            dueDate: string | null;
            categoryId: string;
            category: string;
            categoryColor: string;
            createdAt: string;
        }[];
        totalRevenue: number;
        totalExpenses: number;
        netProfit: number;
        profitMargin: number;
        pendingReceivables: number;
        pendingPayables: number;
        monthlyCashFlow: {
            month: string;
            income: number;
            expense: number;
        }[];
        expenseByCategory: {
            categoryId: string;
            categoryName: string;
            amount: number;
            color: string;
        }[];
        period: {
            month: number | null;
            year: number;
        };
    }>;
    getTransactions(userId: string, query: QueryTransactionsDto): Promise<{
        data: {
            id: string;
            description: string;
            amount: number;
            type: "income" | "expense";
            status: "paid" | "pending" | "overdue";
            date: string;
            dueDate: string | null;
            categoryId: string;
            category: string;
            categoryColor: string;
            createdAt: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createTransaction(userId: string, dto: CreateTransactionDto): Promise<{
        id: string;
        description: string;
        amount: number;
        type: "income" | "expense";
        status: "paid" | "pending" | "overdue";
        date: string;
        dueDate: string | null;
        categoryId: string;
        category: string;
        categoryColor: string;
        createdAt: string;
    }>;
    updateTransaction(userId: string, id: string, dto: UpdateTransactionDto): Promise<{
        id: string;
        description: string;
        amount: number;
        type: "income" | "expense";
        status: "paid" | "pending" | "overdue";
        date: string;
        dueDate: string | null;
        categoryId: string;
        category: string;
        categoryColor: string;
        createdAt: string;
    }>;
    deleteTransaction(userId: string, id: string): Promise<void>;
    generateReceivablesFromContract(userId: string, contract: Contract & {
        client: Client;
    }): Promise<{
        id: string;
        description: string;
        amount: number;
        type: "income" | "expense";
        status: "paid" | "pending" | "overdue";
        date: string;
        dueDate: string | null;
        categoryId: string;
        category: string;
        categoryColor: string;
        createdAt: string;
    }[]>;
    private resolveIncomeCategory;
    private buildPaymentSchedule;
    private resolveStatus;
    private ensureCategoryExists;
    private validateCategoryType;
    private findUserTransaction;
    private toTransactionResponse;
}
export {};
