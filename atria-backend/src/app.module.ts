import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssetsModule } from './assets/assets.module';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calendar/calendar.module';
import { ClientGroupsModule } from './client-groups/client-groups.module';
import { ClientsModule } from './clients/clients.module';
import { ContractsModule } from './contracts/contracts.module';
import { ContentModule } from './content/content.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FinanceModule } from './finance/finance.module';
import { KanbanModule } from './kanban/kanban.module';
import { MetaInsightsModule } from './meta-insights/meta-insights.module';
import { MessageModule } from './message/message.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { TimesheetModule } from './timesheet/timesheet.module';
import { UserGroupsModule } from './user-groups/user-groups.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    AssetsModule,
    CalendarModule,
    ClientsModule,
    ClientGroupsModule,
    ContractsModule,
    ContentModule,
    DashboardModule,
    FinanceModule,
    KanbanModule,
    MetaInsightsModule,
    MessageModule,
    NotificationsModule,
    ReportsModule,
    SettingsModule,
    TimesheetModule,
    UserGroupsModule,
    UsersModule,
  ],
})
export class AppModule {}
