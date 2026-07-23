export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export type UserRole = "admin" | "manager" | "user";

export interface UserGroup {
  id: string;
  name: string;
  description: string | null;
  color: string;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  hourlyRate: number | null;
  mustChangePassword: boolean;
  userGroup: Pick<UserGroup, "id" | "name" | "description" | "color"> | null;
  createdAt: string;
}

export interface ProvisionUserInput {
  name: string;
  role: "ADMIN" | "MANAGER" | "USER";
  userGroupId?: string;
  hourlyRate?: number;
  emailDomain?: string;
}

export interface ProvisionUserResult {
  user: ManagedUser;
  credentials: {
    email: string;
    temporaryPassword: string;
  };
}

export interface CreateUserGroupInput {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateUserGroupInput extends Partial<CreateUserGroupInput> {}

export interface ClientGroup {
  id: string;
  name: string;
  description: string | null;
  color: string;
  clientCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientGroupInput {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateClientGroupInput extends Partial<CreateClientGroupInput> {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  color?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  category: "meeting" | "deadline" | "publish" | "other";
  color: string;
  isPending: boolean;
  createdBy: TeamMember;
  assignee: TeamMember | null;
}

export interface CreateCalendarEventInput {
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  category?: "meeting" | "deadline" | "publish" | "other";
  color?: string;
  isPending?: boolean;
  assigneeId?: string;
}

export type KanbanPriority =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "planned";

export type KanbanColumnType =
  | "to_do"
  | "in_progress"
  | "done"
  | "custom";

export interface KanbanColumn {
  id: string;
  title: string;
  order: number;
  color: string;
  type: KanbanColumnType | null;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string | null;
  columnId: string;
  column: KanbanColumn;
  clientId: string | null;
  client: { id: string; companyName: string; avatarUrl: string | null } | null;
  priority: KanbanPriority;
  order: number;
  dueDate: string | null;
  assignees: TeamMember[];
  createdBy: TeamMember;
  totalLoggedSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: string;
  user: TeamMember;
}

export interface TaskHistoryEntry {
  id: string;
  action: string;
  createdAt: string;
  user: TeamMember;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  columnId: string;
  priority?: KanbanPriority;
  dueDate?: string;
  assigneeIds?: string[];
  clientId?: string;
}

export interface CreateColumnInput {
  title: string;
  color?: string;
}

export interface UpdateColumnInput {
  title?: string;
  color?: string;
}

/** @deprecated Use KanbanTask */
export interface KanbanCard {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  order: number;
}

/** @deprecated Use KanbanColumn + KanbanTask */
export interface KanbanBoard {
  id: string;
  name: string;
  columns: KanbanColumn[];
  cards: KanbanCard[];
}

export interface FinanceCategory {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
}

export interface FinanceOverview {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  pendingReceivables: number;
  pendingPayables: number;
  monthlyCashFlow: { month: string; income: number; expense: number }[];
  expenseByCategory: {
    categoryId: string;
    categoryName: string;
    amount: number;
    color: string;
  }[];
  recentTransactions: FinanceTransaction[];
}

export interface FinanceTransaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string | null;
  categoryId: string;
  category: string;
  categoryColor?: string;
  createdAt?: string;
}

export type TransactionSortField = "date" | "amount" | "description" | "status";
export type SortOrder = "asc" | "desc";

export interface TransactionFilters {
  search: string;
  categoryIds: string[];
  status: "" | "paid" | "pending" | "overdue";
  type: "" | "income" | "expense";
  startDate: string;
  endDate: string;
  sortBy: TransactionSortField;
  sortOrder: SortOrder;
}

export interface CreateCategoryInput {
  name: string;
  type: "income" | "expense";
  color?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
}

export interface PaginatedTransactions {
  data: FinanceTransaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTransactionInput {
  description: string;
  amount: number;
  type: "income" | "expense";
  status?: "paid" | "pending" | "overdue";
  date: string;
  dueDate?: string;
  categoryId: string;
}

export interface ContentAttachment {
  id: string;
  name: string;
  url: string;
  mimeType: string | null;
}

export type ContentPlatform = "instagram" | "tiktok" | "youtube" | "linkedin";
export type ContentPostFormat = "carousel" | "reels" | "static" | "story";
export type ContentPostStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "scheduled"
  | "published";

export type PostFeedbackType = "rejection_reason" | "general_note";

export interface Client {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  website: string | null;
  street: string | null;
  number: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  address: string | null;
  notes: string | null;
  avatarUrl: string | null;
  clientGroup: Pick<ClientGroup, "id" | "name" | "description" | "color"> | null;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientInput {
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  website?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  avatarUrl?: string;
  clientGroupId?: string;
}

export interface UpdateClientInput extends Partial<CreateClientInput> {}

export type ContractStatus =
  | "draft"
  | "sent"
  | "signed"
  | "expired"
  | "cancelled";

export type PaymentFrequency = "monthly" | "one_time";

export interface Contract {
  id: string;
  clientId: string;
  client: {
    id: string;
    companyName: string;
    contactName: string | null;
    email: string | null;
    avatarUrl: string | null;
  };
  title: string;
  status: ContractStatus;
  recurringValue: number;
  paymentFrequency: PaymentFrequency;
  startDate: string;
  endDate: string | null;
  termsContent: string;
  pdfUrl: string | null;
  createdBy: { id: string; name: string; avatarUrl: string | null };
  receivablesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractInput {
  clientId: string;
  title: string;
  status?: ContractStatus;
  recurringValue: number;
  paymentFrequency?: PaymentFrequency;
  startDate: string;
  endDate?: string;
  termsContent: string;
  pdfUrl?: string;
}

export interface UpdateContractInput extends Partial<CreateContractInput> {}

export interface SignContractResult {
  contract: Contract;
  receivablesGenerated: number;
  receivables: unknown[];
}

export interface ContentPostClient {
  id: string;
  companyName: string;
  avatarUrl: string | null;
  instagram: string | null;
}

export interface ContentPost {
  id: string;
  title: string;
  clientId: string;
  client: ContentPostClient;
  platform: ContentPlatform;
  format: ContentPostFormat;
  scheduledDate: string | null;
  status: ContentPostStatus;
  copy: string;
  attachments: ContentAttachment[];
  author: { id: string; name: string; avatarUrl: string | null };
  assignee: { id: string; name: string; avatarUrl: string | null } | null;
  platformColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentOverview {
  drafts: number;
  pendingApproval: number;
  scheduled: number;
  published: number;
  total: number;
}

export interface ContentCalendarItem {
  id: string;
  title: string;
  platform: ContentPlatform;
  scheduledDate: string;
  status: ContentPostStatus;
  clientName?: string;
  color: string;
}

export interface CreateContentPostInput {
  title: string;
  clientId: string;
  platform: ContentPlatform;
  format?: ContentPostFormat;
  scheduledDate?: string;
  status?: ContentPostStatus;
  copy: string;
  assigneeId?: string;
  attachments?: { name: string; url: string; mimeType?: string }[];
}

export interface PostVersion {
  id: string;
  postId: string;
  versionNumber: number;
  versionLabel: string;
  title: string;
  copyText: string;
  mediaUrls: string[];
  createdBy: { id: string; name: string; avatarUrl: string | null };
  createdAt: string;
}

export interface PostFeedback {
  id: string;
  postId: string;
  versionId: string | null;
  versionLabel: string | null;
  comment: string;
  type: PostFeedbackType;
  user: { id: string; name: string; avatarUrl: string | null };
  createdAt: string;
}

export interface PostHistoryTimelineItem {
  kind: "version" | "feedback";
  id: string;
  createdAt: string;
  data: PostVersion | PostFeedback;
}

export interface PostHistory {
  versions: PostVersion[];
  feedback: PostFeedback[];
  timeline: PostHistoryTimelineItem[];
}

export interface CreatePostVersionInput {
  title: string;
  copyText: string;
  mediaUrls?: string[];
}

export interface RejectContentPostInput {
  rejectionReason: string;
}

/** @deprecated Use ContentPost */
export interface ContentItem {
  id: string;
  title: string;
  client: string;
  type: "post" | "video" | "story" | "reels" | "campaign";
  status: "briefing" | "production" | "review" | "approved" | "published";
  dueDate: string;
  assignee?: string;
}

export interface CreationOverview {
  inProduction: number;
  inReview: number;
  approved: number;
  published: number;
  items: ContentItem[];
}

export type Platform = "all" | "tiktok" | "instagram" | "facebook";

export interface PerformanceSummary {
  id: string;
  platform: "tiktok" | "instagram" | "facebook";
  title: string;
  description: string;
  views: number;
  newFollowers: number;
  engagementRate: string;
  totalComments: number;
  sharesCount: number;
  date: string;
  viewsTrend: { time: string; views: number }[];
  followerGrowth: { date: string; followers: number }[];
}

export interface PerformanceOverview {
  totalViews: number;
  totalFollowers: number;
  avgEngagement: string;
  topPlatform: string;
  summaries: PerformanceSummary[];
}

export interface DashboardOverview {
  user: {
    name: string;
    notificationCount: number;
  };
  finance: {
    revenue: number;
    expenses: number;
    netProfit: number;
    monthlyTrend: { month: string; income: number; expense: number }[];
  };
  contentAndMeta: {
    topCampaign: {
      id: string;
      name: string;
      roas: number;
      spend: number;
      ctr: number;
      status: string;
    } | null;
    scheduledPosts: {
      id: string;
      title: string;
      platform: string;
      scheduledDate: string;
    }[];
  };
  calendar: {
    todayMeetings: {
      id: string;
      title: string;
      startAt: string;
      endAt: string;
      category: string;
      color: string;
      isPending: boolean;
    }[];
  };
  kanban: {
    myTasks: {
      id: string;
      title: string;
      column: string;
      priority: string;
    }[];
  };
}

/** @deprecated Use CalendarEvent */
export type AgendaEvent = CalendarEvent;

export type MetaCampaignStatus =
  | "active"
  | "paused"
  | "completed"
  | "learning";

export interface MetaInsightsOverview {
  reach: number;
  impressions: number;
  totalSpend: number;
  roas: number;
  engagementRate: number;
  activeCampaigns: number;
  totalConversions: number;
}

export interface MetaPerformancePoint {
  date: string;
  spend: number;
  conversions: number;
}

export interface MetaCampaign {
  id: string;
  name: string;
  status: MetaCampaignStatus;
  budget: number;
  budgetType: "daily" | "lifetime";
  spend: number;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
  ctr: number;
  roas: number;
  startDate: string;
  endDate: string | null;
}

export interface ReportMetaMetrics {
  reach: number;
  impressions: number;
  spend: number;
  engagement: number;
  engagementRate: number;
  conversions: number;
  roas: number;
  activeCampaigns: number;
  performanceChart: {
    date: string;
    spend: number;
    reach: number;
    engagement: number;
  }[];
}

export interface ReportContentPost {
  id: string;
  title: string;
  platform: ContentPlatform;
  format: ContentPostFormat;
  scheduledDate: string | null;
  status: ContentPostStatus;
  copy?: string;
}

export interface ReportActiveProject {
  id: string;
  title: string;
  status: ContractStatus;
  recurringValue: number;
  paymentFrequency: PaymentFrequency;
  startDate: string;
  endDate: string | null;
}

export interface ReportData {
  client: {
    id: string;
    companyName: string;
    contactName: string | null;
    email: string | null;
    avatarUrl: string | null;
    instagram: string | null;
  };
  period: { month: number; year: number; label: string };
  content: {
    completedPosts: ReportContentPost[];
    byPlatform: Record<string, number>;
    byFormat: Record<string, number>;
    publishedCount: number;
  };
  meta: ReportMetaMetrics;
  projects: { activeContracts: ReportActiveProject[] };
  summary: {
    totalPostsPublished: number;
    activeProjectsCount: number;
    metaReach: number;
    metaSpend: number;
    metaEngagement: number;
  };
}

export interface ClientReport {
  id: string;
  clientId: string;
  client: {
    id: string;
    companyName: string;
    contactName: string | null;
    email: string | null;
    avatarUrl: string | null;
    instagram: string | null;
  };
  month: number;
  year: number;
  title: string;
  data: ReportData;
  generatedBy: { id: string; name: string; avatarUrl: string | null };
  createdAt: string;
}

export interface GenerateReportInput {
  month: number;
  year: number;
}

export interface PortalTokenResult {
  clientId: string;
  companyName: string;
  token: string;
  portalUrl: string;
}

export interface PortalReportSummary {
  id: string;
  title: string;
  month: number;
  year: number;
  periodLabel: string;
  createdAt: string;
}

export interface PortalData {
  client: {
    id: string;
    companyName: string;
    contactName: string | null;
    email: string | null;
    avatarUrl: string | null;
    instagram: string | null;
  } | null;
  accountStatus: {
    activeContracts: number;
    pendingApprovals: number;
    scheduledPosts: number;
    publishedPosts: number;
    status: "active" | "onboarding";
  };
  pendingApprovalPosts: ReportContentPost[];
  scheduledPosts: ReportContentPost[];
  recentReports: PortalReportSummary[];
  contracts: ReportActiveProject[];
}

export interface TimeLog {
  id: string;
  taskId: string;
  task: {
    id: string;
    title: string;
    clientId: string | null;
    client: { id: string; companyName: string } | null;
  };
  userId: string;
  user: { id: string; name: string; avatarUrl: string | null };
  startTime: string;
  endTime: string | null;
  durationInSeconds: number | null;
  elapsedSeconds: number;
  isRunning: boolean;
  notes: string | null;
  createdAt: string;
}

export interface TaskTimeSummary {
  taskId: string;
  totalLoggedSeconds: number;
  activeLog: TimeLog | null;
  logs: TimeLog[];
}

export interface TeamMemberHours {
  userId: string;
  name: string;
  avatarUrl: string | null;
  totalSeconds: number;
  totalHours: number;
  logCount: number;
}

export interface ClientHours {
  clientId: string;
  companyName: string;
  totalSeconds: number;
  totalHours: number;
  logCount: number;
}

export interface TeamSummary {
  byMember: TeamMemberHours[];
  byClient: ClientHours[];
}

export interface ClientProfitability {
  clientId: string;
  companyName: string;
  avatarUrl: string | null;
  monthlyRevenue: number;
  totalHours: number;
  laborCost: number;
  profit: number;
  margin: number;
  activeContracts: number;
}

export interface ProfitabilityOverview {
  avgHourlyRate: number;
  totalRevenue: number;
  totalLaborCost: number;
  totalProfit: number;
  totalHours: number;
  clients: ClientProfitability[];
  teamSummary: TeamSummary;
}

export type AssetFileType = "image" | "logo" | "brand_guide" | "document";

export interface Asset {
  id: string;
  clientId: string;
  client: { id: string; companyName: string; avatarUrl: string | null };
  fileName: string;
  fileType: AssetFileType;
  fileUrl: string;
  fileSize: number;
  uploadedBy: { id: string; name: string; avatarUrl: string | null } | null;
  uploadedAt: string;
}

export interface ClientAssetGroup {
  client: { id: string; companyName: string; avatarUrl: string | null };
  assets: Asset[];
}

export type NotificationType =
  | "task_assigned"
  | "contract_signed"
  | "post_pending";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
