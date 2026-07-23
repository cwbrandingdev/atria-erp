"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const assets_module_1 = require("./assets/assets.module");
const auth_module_1 = require("./auth/auth.module");
const calendar_module_1 = require("./calendar/calendar.module");
const client_groups_module_1 = require("./client-groups/client-groups.module");
const clients_module_1 = require("./clients/clients.module");
const contracts_module_1 = require("./contracts/contracts.module");
const content_module_1 = require("./content/content.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const finance_module_1 = require("./finance/finance.module");
const kanban_module_1 = require("./kanban/kanban.module");
const meta_insights_module_1 = require("./meta-insights/meta-insights.module");
const message_module_1 = require("./message/message.module");
const notifications_module_1 = require("./notifications/notifications.module");
const prisma_module_1 = require("./prisma/prisma.module");
const reports_module_1 = require("./reports/reports.module");
const settings_module_1 = require("./settings/settings.module");
const timesheet_module_1 = require("./timesheet/timesheet.module");
const user_groups_module_1 = require("./user-groups/user-groups.module");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            assets_module_1.AssetsModule,
            calendar_module_1.CalendarModule,
            clients_module_1.ClientsModule,
            client_groups_module_1.ClientGroupsModule,
            contracts_module_1.ContractsModule,
            content_module_1.ContentModule,
            dashboard_module_1.DashboardModule,
            finance_module_1.FinanceModule,
            kanban_module_1.KanbanModule,
            meta_insights_module_1.MetaInsightsModule,
            message_module_1.MessageModule,
            notifications_module_1.NotificationsModule,
            reports_module_1.ReportsModule,
            settings_module_1.SettingsModule,
            timesheet_module_1.TimesheetModule,
            user_groups_module_1.UserGroupsModule,
            users_module_1.UsersModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map