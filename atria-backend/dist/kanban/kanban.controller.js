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
exports.KanbanController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const comment_dto_1 = require("./dto/comment.dto");
const column_dto_1 = require("./dto/column.dto");
const task_dto_1 = require("./dto/task.dto");
const kanban_service_1 = require("./kanban.service");
let KanbanController = class KanbanController {
    kanbanService;
    constructor(kanbanService) {
        this.kanbanService = kanbanService;
    }
    getColumns() {
        return this.kanbanService.getColumns();
    }
    createColumn(dto) {
        return this.kanbanService.createColumn(dto);
    }
    reorderColumns(dto) {
        return this.kanbanService.reorderColumns(dto);
    }
    updateColumn(id, dto) {
        return this.kanbanService.updateColumn(id, dto);
    }
    deleteColumn(id) {
        return this.kanbanService.deleteColumn(id);
    }
    getTasks(query) {
        return this.kanbanService.getTasks(query);
    }
    getTask(id) {
        return this.kanbanService.getTask(id);
    }
    createTask(user, dto) {
        return this.kanbanService.createTask(user.userId, dto);
    }
    updateTask(user, id, dto) {
        return this.kanbanService.updateTask(user.userId, id, dto);
    }
    moveTask(user, id, dto) {
        return this.kanbanService.moveTask(user.userId, id, dto);
    }
    deleteTask(id) {
        return this.kanbanService.deleteTask(id);
    }
    getComments(id) {
        return this.kanbanService.getComments(id);
    }
    createComment(user, id, dto) {
        return this.kanbanService.createComment(user.userId, id, dto);
    }
    getHistory(id) {
        return this.kanbanService.getHistory(id);
    }
};
exports.KanbanController = KanbanController;
__decorate([
    (0, common_1.Get)('columns'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "getColumns", null);
__decorate([
    (0, common_1.Post)('columns'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [column_dto_1.CreateColumnDto]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "createColumn", null);
__decorate([
    (0, common_1.Patch)('columns/reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [column_dto_1.ReorderColumnsDto]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "reorderColumns", null);
__decorate([
    (0, common_1.Patch)('columns/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, column_dto_1.UpdateColumnDto]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "updateColumn", null);
__decorate([
    (0, common_1.Delete)('columns/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "deleteColumn", null);
__decorate([
    (0, common_1.Get)('tasks'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_dto_1.QueryTasksDto]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Get)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "getTask", null);
__decorate([
    (0, common_1.Post)('tasks'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "createTask", null);
__decorate([
    (0, common_1.Patch)('tasks/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Patch)('tasks/:id/move'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, task_dto_1.MoveTaskDto]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "moveTask", null);
__decorate([
    (0, common_1.Delete)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Get)('tasks/:id/comments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)('tasks/:id/comments'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "createComment", null);
__decorate([
    (0, common_1.Get)('tasks/:id/history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KanbanController.prototype, "getHistory", null);
exports.KanbanController = KanbanController = __decorate([
    (0, common_1.Controller)('kanban'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [kanban_service_1.KanbanService])
], KanbanController);
//# sourceMappingURL=kanban.controller.js.map