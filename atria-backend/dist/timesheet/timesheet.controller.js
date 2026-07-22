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
exports.ProfitabilityController = exports.TimeLogsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const time_log_dto_1 = require("./dto/time-log.dto");
const profitability_service_1 = require("./profitability.service");
const time_logs_service_1 = require("./time-logs.service");
let TimeLogsController = class TimeLogsController {
    timeLogsService;
    constructor(timeLogsService) {
        this.timeLogsService = timeLogsService;
    }
    findAll(query) {
        return this.timeLogsService.findAll(query);
    }
    getActive(user) {
        return this.timeLogsService.getActiveTimer(user.userId);
    }
    getTeamSummary() {
        return this.timeLogsService.getTeamSummary();
    }
    getTaskSummary(taskId) {
        return this.timeLogsService.getTaskSummary(taskId);
    }
    start(user, dto) {
        return this.timeLogsService.startTimer(user.userId, dto);
    }
    stop(user, dto) {
        return this.timeLogsService.stopTimer(user.userId, dto);
    }
    createManual(user, dto) {
        return this.timeLogsService.createManual(user.userId, dto);
    }
};
exports.TimeLogsController = TimeLogsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [time_log_dto_1.QueryTimeLogsDto]),
    __metadata("design:returntype", void 0)
], TimeLogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TimeLogsController.prototype, "getActive", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TimeLogsController.prototype, "getTeamSummary", null);
__decorate([
    (0, common_1.Get)('task/:taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeLogsController.prototype, "getTaskSummary", null);
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, time_log_dto_1.StartTimerDto]),
    __metadata("design:returntype", void 0)
], TimeLogsController.prototype, "start", null);
__decorate([
    (0, common_1.Post)('stop'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, time_log_dto_1.StopTimerDto]),
    __metadata("design:returntype", void 0)
], TimeLogsController.prototype, "stop", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, time_log_dto_1.CreateTimeLogDto]),
    __metadata("design:returntype", void 0)
], TimeLogsController.prototype, "createManual", null);
exports.TimeLogsController = TimeLogsController = __decorate([
    (0, common_1.Controller)('time-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [time_logs_service_1.TimeLogsService])
], TimeLogsController);
let ProfitabilityController = class ProfitabilityController {
    profitabilityService;
    constructor(profitabilityService) {
        this.profitabilityService = profitabilityService;
    }
    getOverview() {
        return this.profitabilityService.getOverview();
    }
    getClients() {
        return this.profitabilityService.getClientProfitability();
    }
};
exports.ProfitabilityController = ProfitabilityController;
__decorate([
    (0, common_1.Get)('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProfitabilityController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('clients'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProfitabilityController.prototype, "getClients", null);
exports.ProfitabilityController = ProfitabilityController = __decorate([
    (0, common_1.Controller)('profitability'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [profitability_service_1.ProfitabilityService])
], ProfitabilityController);
//# sourceMappingURL=timesheet.controller.js.map