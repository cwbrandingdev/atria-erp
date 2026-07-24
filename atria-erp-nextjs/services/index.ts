export { apiRequest, ApiError, API_BASE_URL, uploadFile } from "./api";
export { toast, showApiError } from "@/lib/toast";

export * as authService from "./auth.service";
export * as calendarService from "./calendar.service";
export * as kanbanService from "./kanban.service";
export * as financeService from "./finance.service";
export * as clientsService from "./clients.service";
export * as clientGroupsService from "./client-groups.service";
export * as contractsService from "./contracts.service";
export * as reportsService from "./reports.service";
export * as portalService from "./portal.service";
export * as timesheetService from "./timesheet.service";
export * as assetsService from "./assets.service";
export * as notificationsService from "./notifications.service";
export * as settingsService from "./settings.service";
export * as usersService from "./users.service";
export * as userGroupsService from "./user-groups.service";
export * as contentService from "./content.service";
export * as creationService from "./creation.service";
export * as insightsService from "./insights.service";
export * as performanceService from "./insights.service";
export * as dashboardService from "./dashboard.service";
/** @deprecated Use calendarService */
export * as agendaService from "./calendar.service";

export type * from "./types";
