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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const category_dto_1 = require("./dto/category.dto");
const transaction_dto_1 = require("./dto/transaction.dto");
const query_finance_dto_1 = require("./dto/query-finance.dto");
const finance_service_1 = require("./finance.service");
let FinanceController = class FinanceController {
    financeService;
    constructor(financeService) {
        this.financeService = financeService;
    }
    getOverview(user, query) {
        return this.financeService.getOverview(user.userId, query);
    }
    getCashFlow(user, query) {
        return this.financeService.getCashFlow(user.userId, query);
    }
    getCategories(type) {
        return this.financeService.getCategories(type);
    }
    createCategory(dto) {
        return this.financeService.createCategory(dto);
    }
    updateCategory(id, dto) {
        return this.financeService.updateCategory(id, dto);
    }
    deleteCategory(id) {
        return this.financeService.deleteCategory(id);
    }
    getTransactions(user, query) {
        return this.financeService.getTransactions(user.userId, query);
    }
    createTransaction(user, dto) {
        return this.financeService.createTransaction(user.userId, dto);
    }
    updateTransaction(user, id, dto) {
        return this.financeService.updateTransaction(user.userId, id, dto);
    }
    deleteTransaction(user, id) {
        return this.financeService.deleteTransaction(user.userId, id);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_finance_dto_1.QueryFinanceDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('cash-flow'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_finance_dto_1.QueryFinanceDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getCashFlow", null);
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('transactions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, transaction_dto_1.QueryTransactionsDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Post)('transactions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createTransaction", null);
__decorate([
    (0, common_1.Patch)('transactions/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateTransaction", null);
__decorate([
    (0, common_1.Delete)('transactions/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteTransaction", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)('finance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map