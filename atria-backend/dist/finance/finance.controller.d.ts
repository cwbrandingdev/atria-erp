import { TransactionType } from '@prisma/client';
import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateTransactionDto, QueryTransactionsDto, UpdateTransactionDto } from './dto/transaction.dto';
import { QueryFinanceDto } from './dto/query-finance.dto';
import { FinanceService } from './finance.service';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    getOverview(user: AuthenticatedUser, query: QueryFinanceDto): Promise<{
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
    getCashFlow(user: AuthenticatedUser, query: QueryFinanceDto): Promise<{
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
    getTransactions(user: AuthenticatedUser, query: QueryTransactionsDto): Promise<{
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
    createTransaction(user: AuthenticatedUser, dto: CreateTransactionDto): Promise<{
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
    updateTransaction(user: AuthenticatedUser, id: string, dto: UpdateTransactionDto): Promise<{
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
    deleteTransaction(user: AuthenticatedUser, id: string): Promise<void>;
}
