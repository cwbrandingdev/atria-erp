import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Contract,
  Client,
  FinancialCategory,
  FinancialTransaction,
  PaymentFrequency,
  Prisma,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import {
  CreateTransactionDto,
  QueryTransactionsDto,
  SortOrder,
  TransactionSortField,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import { QueryFinanceDto } from './dto/query-finance.dto';

type FinancePeriodOptions = Pick<QueryFinanceDto, 'month' | 'year'>;

type TransactionWithCategory = FinancialTransaction & {
  category: FinancialCategory;
};

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories(type?: TransactionType) {
    return this.prisma.financialCategory.findMany({
      where: type ? { type } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.financialCategory.create({
      data: {
        name: dto.name,
        type: dto.type,
        color: dto.color ?? '#004949',
      },
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    await this.ensureCategoryExists(id);

    return this.prisma.financialCategory.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(id: string) {
    await this.ensureCategoryExists(id);

    const transactionCount = await this.prisma.financialTransaction.count({
      where: { categoryId: id },
    });

    if (transactionCount > 0) {
      throw new BadRequestException(
        'Cannot delete a category that has linked transactions',
      );
    }

    await this.prisma.financialCategory.delete({ where: { id } });
  }

  async getCashFlow(userId: string, period?: FinancePeriodOptions) {
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
        status: { in: [TransactionStatus.PAID, TransactionStatus.PENDING] },
      },
      include: { category: true },
    });

    const pendingTransactions = await this.prisma.financialTransaction.findMany({
      where: {
        userId,
        status: { in: [TransactionStatus.PENDING, TransactionStatus.OVERDUE] },
      },
    });

    const monthlyMap = new Map<string, { income: number; expense: number }>();

    for (let m = 0; m < 12; m++) {
      const key = `${year}-${String(m + 1).padStart(2, '0')}`;
      monthlyMap.set(key, { income: 0, expense: 0 });
    }

    const categoryMap = new Map<
      string,
      { categoryId: string; categoryName: string; amount: number; color: string }
    >();

    let totalRevenue = 0;
    let totalExpenses = 0;
    let pendingReceivables = 0;
    let pendingPayables = 0;

    for (const tx of pendingTransactions) {
      const amount = Number(tx.amount);
      if (tx.type === TransactionType.INCOME) {
        pendingReceivables += amount;
      } else {
        pendingPayables += amount;
      }
    }

    for (const tx of transactions) {
      const amount = Number(tx.amount);
      const monthKey = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, '0')}`;
      const monthData = monthlyMap.get(monthKey) ?? { income: 0, expense: 0 };
      const inSelectedPeriod =
        tx.date >= periodStart && tx.date <= periodEnd;

      if (tx.type === TransactionType.INCOME) {
        monthData.income += amount;
        if (inSelectedPeriod) totalRevenue += amount;
      } else {
        monthData.expense += amount;
        if (inSelectedPeriod) {
          totalExpenses += amount;

          const existing = categoryMap.get(tx.categoryId);
          if (existing) {
            existing.amount += amount;
          } else {
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
    const profitMargin =
      totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const monthlyCashFlow = Array.from(monthlyMap.entries()).map(
      ([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
      }),
    );

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

  async getOverview(userId: string, period?: FinancePeriodOptions) {
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
      recentTransactions: recentTransactions.map((tx) =>
        this.toTransactionResponse(tx),
      ),
    };
  }

  async getTransactions(userId: string, query: QueryTransactionsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.FinancialTransactionWhereInput = { userId };

    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

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
      if (from) where.date.gte = new Date(from);
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

    const sortBy = query.sortBy ?? TransactionSortField.DATE;
    const sortOrder = query.sortOrder ?? SortOrder.DESC;

    const orderBy: Prisma.FinancialTransactionOrderByWithRelationInput = {
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

  async createTransaction(userId: string, dto: CreateTransactionDto) {
    await this.ensureCategoryExists(dto.categoryId);
    await this.validateCategoryType(dto.categoryId, dto.type);

    const status = this.resolveStatus(
      dto.status ?? TransactionStatus.PENDING,
      new Date(dto.date),
      dto.dueDate ? new Date(dto.dueDate) : undefined,
    );

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

  async updateTransaction(
    userId: string,
    id: string,
    dto: UpdateTransactionDto,
  ) {
    const existing = await this.findUserTransaction(userId, id);

    if (dto.categoryId) {
      await this.ensureCategoryExists(dto.categoryId);
      const type = dto.type ?? existing.type;
      await this.validateCategoryType(dto.categoryId, type);
    }

    const date = dto.date ? new Date(dto.date) : existing.date;
    const dueDate =
      dto.dueDate !== undefined
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
        dueDate:
          dto.dueDate !== undefined
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

  async deleteTransaction(userId: string, id: string) {
    await this.findUserTransaction(userId, id);
    await this.prisma.financialTransaction.delete({ where: { id } });
  }

  async generateReceivablesFromContract(
    userId: string,
    contract: Contract & { client: Client },
  ) {
    const existingCount = await this.prisma.financialTransaction.count({
      where: { contractId: contract.id },
    });

    if (existingCount > 0) {
      throw new BadRequestException(
        'Receivables have already been generated for this contract',
      );
    }

    const category = await this.resolveIncomeCategory();
    const schedules = this.buildPaymentSchedule(contract);
    const amount = Number(contract.recurringValue);

    const created = await this.prisma.$transaction(
      schedules.map((schedule) =>
        this.prisma.financialTransaction.create({
          data: {
            description: `Contrato: ${contract.title} — ${contract.client.companyName} (${schedule.label})`,
            amount,
            type: TransactionType.INCOME,
            status: TransactionStatus.PENDING,
            date: schedule.date,
            dueDate: schedule.date,
            categoryId: category.id,
            userId,
            contractId: contract.id,
          },
          include: { category: true },
        }),
      ),
    );

    return created.map((tx) => this.toTransactionResponse(tx));
  }

  private async resolveIncomeCategory() {
    const preferred = await this.prisma.financialCategory.findFirst({
      where: {
        type: TransactionType.INCOME,
        name: { in: ['Retainer', 'Contratos', 'Projetos'] },
      },
    });

    if (preferred) return preferred;

    const fallback = await this.prisma.financialCategory.findFirst({
      where: { type: TransactionType.INCOME },
    });

    if (!fallback) {
      throw new BadRequestException(
        'No income category found to create receivables',
      );
    }

    return fallback;
  }

  private buildPaymentSchedule(contract: Contract) {
    const start = new Date(contract.startDate);
    start.setHours(12, 0, 0, 0);

    if (contract.paymentFrequency === PaymentFrequency.ONE_TIME) {
      return [{ date: start, label: 'Único' }];
    }

    const end = contract.endDate
      ? new Date(contract.endDate)
      : new Date(start.getFullYear(), start.getMonth() + 11, start.getDate());

    end.setHours(12, 0, 0, 0);

    const schedules: { date: Date; label: string }[] = [];
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

  private resolveStatus(
    status: TransactionStatus,
    date: Date,
    dueDate?: Date,
  ): TransactionStatus {
    if (status === TransactionStatus.PAID) return TransactionStatus.PAID;

    const reference = dueDate ?? date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reference < today) return TransactionStatus.OVERDUE;
    return TransactionStatus.PENDING;
  }

  private async ensureCategoryExists(id: string) {
    const category = await this.prisma.financialCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  private async validateCategoryType(
    categoryId: string,
    type: TransactionType,
  ) {
    const category = await this.ensureCategoryExists(categoryId);
    if (category.type !== type) {
      throw new BadRequestException(
        'Transaction type does not match category type',
      );
    }
  }

  private async findUserTransaction(userId: string, id: string) {
    const transaction = await this.prisma.financialTransaction.findFirst({
      where: { id, userId },
      include: { category: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  private toTransactionResponse(tx: TransactionWithCategory) {
    return {
      id: tx.id,
      description: tx.description,
      amount: Number(tx.amount),
      type: tx.type.toLowerCase() as 'income' | 'expense',
      status: tx.status.toLowerCase() as 'paid' | 'pending' | 'overdue',
      date: tx.date.toISOString(),
      dueDate: tx.dueDate?.toISOString() ?? null,
      categoryId: tx.categoryId,
      category: tx.category.name,
      categoryColor: tx.category.color,
      createdAt: tx.createdAt.toISOString(),
    };
  }
}
