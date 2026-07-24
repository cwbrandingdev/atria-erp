"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const transaction_dto_1 = require("./dto/transaction.dto");
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategories(type) {
        return this.prisma.financialCategory.findMany({
            where: type ? { type } : undefined,
            orderBy: { name: 'asc' },
        });
    }
    async createCategory(dto) {
        return this.prisma.financialCategory.create({
            data: {
                name: dto.name,
                type: dto.type,
                color: dto.color ?? '#004949',
            },
        });
    }
    async updateCategory(id, dto) {
        await this.ensureCategoryExists(id);
        return this.prisma.financialCategory.update({
            where: { id },
            data: dto,
        });
    }
    async deleteCategory(id) {
        await this.ensureCategoryExists(id);
        const transactionCount = await this.prisma.financialTransaction.count({
            where: { categoryId: id },
        });
        if (transactionCount > 0) {
            throw new common_1.BadRequestException('Cannot delete a category that has linked transactions');
        }
        await this.prisma.financialCategory.delete({ where: { id } });
    }
    async getCashFlow(userId, period) {
        const now = new Date();
        const year = period?.year ?? now.getFullYear();
        const hasMonthFilter = period?.month !== undefined;
        const month = period?.month ?? now.getMonth() + 1;
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
        const periodStart = hasMonthFilter
            ? new Date(year, month - 1, 1)
            : startOfYear;
        const periodEnd = hasMonthFilter
            ? new Date(year, month, 0, 23, 59, 59, 999)
            : endOfYear;
        const transactions = await this.prisma.financialTransaction.findMany({
            where: {
                userId,
                date: { gte: startOfYear, lte: endOfYear },
                status: { in: [client_1.TransactionStatus.PAID, client_1.TransactionStatus.PENDING] },
            },
            include: { category: true },
        });
        const pendingTransactions = await this.prisma.financialTransaction.findMany({
            where: {
                userId,
                status: { in: [client_1.TransactionStatus.PENDING, client_1.TransactionStatus.OVERDUE] },
            },
        });
        const monthlyMap = new Map();
        for (let m = 0; m < 12; m++) {
            const key = `${year}-${String(m + 1).padStart(2, '0')}`;
            monthlyMap.set(key, { income: 0, expense: 0 });
        }
        const categoryMap = new Map();
        let totalRevenue = 0;
        let totalExpenses = 0;
        let pendingReceivables = 0;
        let pendingPayables = 0;
        for (const tx of pendingTransactions) {
            const amount = Number(tx.amount);
            if (tx.type === client_1.TransactionType.INCOME) {
                pendingReceivables += amount;
            }
            else {
                pendingPayables += amount;
            }
        }
        for (const tx of transactions) {
            const amount = Number(tx.amount);
            const monthKey = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, '0')}`;
            const monthData = monthlyMap.get(monthKey) ?? { income: 0, expense: 0 };
            const inSelectedPeriod = tx.date >= periodStart && tx.date <= periodEnd;
            if (tx.type === client_1.TransactionType.INCOME) {
                monthData.income += amount;
                if (inSelectedPeriod)
                    totalRevenue += amount;
            }
            else {
                monthData.expense += amount;
                if (inSelectedPeriod) {
                    totalExpenses += amount;
                    const existing = categoryMap.get(tx.categoryId);
                    if (existing) {
                        existing.amount += amount;
                    }
                    else {
                        categoryMap.set(tx.categoryId, {
                            categoryId: tx.categoryId,
                            categoryName: tx.category.name,
                            amount,
                            color: tx.category.color,
                        });
                    }
                }
            }
            monthlyMap.set(monthKey, monthData);
        }
        const netProfit = totalRevenue - totalExpenses;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
        const monthlyCashFlow = Array.from(monthlyMap.entries()).map(([month, data]) => ({
            month,
            income: data.income,
            expense: data.expense,
        }));
        return {
            totalRevenue,
            totalExpenses,
            netProfit,
            profitMargin: Math.round(profitMargin * 100) / 100,
            pendingReceivables,
            pendingPayables,
            monthlyCashFlow,
            expenseByCategory: Array.from(categoryMap.values()),
            period: {
                month: hasMonthFilter ? month : null,
                year,
            },
        };
    }
    async getOverview(userId, period) {
        const cashFlow = await this.getCashFlow(userId, period);
        const year = period?.year ?? new Date().getFullYear();
        const month = period?.month ?? new Date().getMonth() + 1;
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
        const recentTransactions = await this.prisma.financialTransaction.findMany({
            where: {
                userId,
                date: period?.month
                    ? { gte: startOfMonth, lte: endOfMonth }
                    : { gte: new Date(year, 0, 1) },
            },
            include: { category: true },
            orderBy: { date: 'desc' },
            take: 5,
        });
        return {
            ...cashFlow,
            recentTransactions: recentTransactions.map((tx) => this.toTransactionResponse(tx)),
        };
    }
    async getTransactions(userId, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (query.type)
            where.type = query.type;
        if (query.status)
            where.status = query.status;
        const categoryIds = query.categoryIds?.length
            ? query.categoryIds
            : query.categoryId
                ? [query.categoryId]
                : undefined;
        if (categoryIds?.length) {
            where.categoryId = { in: categoryIds };
        }
        const from = query.from ?? query.startDate;
        const to = query.to ?? query.endDate;
        if (from || to) {
            where.date = {};
            if (from)
                where.date.gte = new Date(from);
            if (to) {
                const endDate = new Date(to);
                endDate.setHours(23, 59, 59, 999);
                where.date.lte = endDate;
            }
        }
        if (query.search?.trim()) {
            where.description = {
                contains: query.search.trim(),
                mode: 'insensitive',
            };
        }
        const sortBy = query.sortBy ?? transaction_dto_1.TransactionSortField.DATE;
        const sortOrder = query.sortOrder ?? transaction_dto_1.SortOrder.DESC;
        const orderBy = {
            [sortBy]: sortOrder,
        };
        const [total, transactions] = await Promise.all([
            this.prisma.financialTransaction.count({ where }),
            this.prisma.financialTransaction.findMany({
                where,
                include: { category: true },
                orderBy,
                skip,
                take: limit,
            }),
        ]);
        return {
            data: transactions.map((tx) => this.toTransactionResponse(tx)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createTransaction(userId, dto) {
        await this.ensureCategoryExists(dto.categoryId);
        await this.validateCategoryType(dto.categoryId, dto.type);
        const status = this.resolveStatus(dto.status ?? client_1.TransactionStatus.PENDING, new Date(dto.date), dto.dueDate ? new Date(dto.dueDate) : undefined);
        const transaction = await this.prisma.financialTransaction.create({
            data: {
                description: dto.description,
                amount: dto.amount,
                type: dto.type,
                status,
                date: new Date(dto.date),
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                categoryId: dto.categoryId,
                userId,
            },
            include: { category: true },
        });
        return this.toTransactionResponse(transaction);
    }
    async updateTransaction(userId, id, dto) {
        const existing = await this.findUserTransaction(userId, id);
        if (dto.categoryId) {
            await this.ensureCategoryExists(dto.categoryId);
            const type = dto.type ?? existing.type;
            await this.validateCategoryType(dto.categoryId, type);
        }
        const date = dto.date ? new Date(dto.date) : existing.date;
        const dueDate = dto.dueDate !== undefined
            ? dto.dueDate
                ? new Date(dto.dueDate)
                : null
            : existing.dueDate;
        const status = dto.status
            ? this.resolveStatus(dto.status, date, dueDate ?? undefined)
            : existing.status;
        const transaction = await this.prisma.financialTransaction.update({
            where: { id },
            data: {
                ...dto,
                date: dto.date ? new Date(dto.date) : undefined,
                dueDate: dto.dueDate !== undefined
                    ? dto.dueDate
                        ? new Date(dto.dueDate)
                        : null
                    : undefined,
                status,
            },
            include: { category: true },
        });
        return this.toTransactionResponse(transaction);
    }
    async deleteTransaction(userId, id) {
        await this.findUserTransaction(userId, id);
        await this.prisma.financialTransaction.delete({ where: { id } });
    }
    async generateReceivablesFromContract(userId, contract) {
        const existingCount = await this.prisma.financialTransaction.count({
            where: { contractId: contract.id },
        });
        if (existingCount > 0) {
            throw new common_1.BadRequestException('Receivables have already been generated for this contract');
        }
        const category = await this.resolveIncomeCategory();
        const schedules = this.buildPaymentSchedule(contract);
        const amount = Number(contract.recurringValue);
        const created = await this.prisma.$transaction(schedules.map((schedule) => this.prisma.financialTransaction.create({
            data: {
                description: `Contrato: ${contract.title} — ${contract.client.companyName} (${schedule.label})`,
                amount,
                type: client_1.TransactionType.INCOME,
                status: client_1.TransactionStatus.PENDING,
                date: schedule.date,
                dueDate: schedule.date,
                categoryId: category.id,
                userId,
                contractId: contract.id,
            },
            include: { category: true },
        })));
        return created.map((tx) => this.toTransactionResponse(tx));
    }
    async resolveIncomeCategory() {
        const preferred = await this.prisma.financialCategory.findFirst({
            where: {
                type: client_1.TransactionType.INCOME,
                name: { in: ['Retainer', 'Contratos', 'Projetos'] },
            },
        });
        if (preferred)
            return preferred;
        const fallback = await this.prisma.financialCategory.findFirst({
            where: { type: client_1.TransactionType.INCOME },
        });
        if (!fallback) {
            throw new common_1.BadRequestException('No income category found to create receivables');
        }
        return fallback;
    }
    buildPaymentSchedule(contract) {
        const start = new Date(contract.startDate);
        start.setHours(12, 0, 0, 0);
        if (contract.paymentFrequency === client_1.PaymentFrequency.ONE_TIME) {
            return [{ date: start, label: 'Único' }];
        }
        const end = contract.endDate
            ? new Date(contract.endDate)
            : new Date(start.getFullYear(), start.getMonth() + 11, start.getDate());
        end.setHours(12, 0, 0, 0);
        const schedules = [];
        const cursor = new Date(start);
        while (cursor <= end) {
            const monthLabel = cursor.toLocaleDateString('pt-BR', {
                month: 'short',
                year: 'numeric',
            });
            schedules.push({
                date: new Date(cursor),
                label: monthLabel,
            });
            cursor.setMonth(cursor.getMonth() + 1);
        }
        return schedules.length > 0 ? schedules : [{ date: start, label: 'Único' }];
    }
    resolveStatus(status, date, dueDate) {
        if (status === client_1.TransactionStatus.PAID)
            return client_1.TransactionStatus.PAID;
        const reference = dueDate ?? date;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (reference < today)
            return client_1.TransactionStatus.OVERDUE;
        return client_1.TransactionStatus.PENDING;
    }
    async ensureCategoryExists(id) {
        const category = await this.prisma.financialCategory.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async validateCategoryType(categoryId, type) {
        const category = await this.ensureCategoryExists(categoryId);
        if (category.type !== type) {
            throw new common_1.BadRequestException('Transaction type does not match category type');
        }
    }
    async findUserTransaction(userId, id) {
        const transaction = await this.prisma.financialTransaction.findFirst({
            where: { id, userId },
            include: { category: true },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    toTransactionResponse(tx) {
        return {
            id: tx.id,
            description: tx.description,
            amount: Number(tx.amount),
            type: tx.type.toLowerCase(),
            status: tx.status.toLowerCase(),
            date: tx.date.toISOString(),
            dueDate: tx.dueDate?.toISOString() ?? null,
            categoryId: tx.categoryId,
            category: tx.category.name,
            categoryColor: tx.category.color,
            createdAt: tx.createdAt.toISOString(),
        };
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map