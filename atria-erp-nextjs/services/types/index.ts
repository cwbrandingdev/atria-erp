export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  order: number;
}

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

export interface KanbanBoard {
  id: string;
  name: string;
  columns: KanbanColumn[];
  cards: KanbanCard[];
}

export interface FinanceOverview {
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
  pendingInvoices: number;
  monthlyRevenue: { month: string; amount: number }[];
  recentTransactions: FinanceTransaction[];
}

export interface FinanceTransaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
}

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
  finance: {
    balance: number;
    revenue: number;
    expenses: number;
  };
  creation: {
    inProduction: number;
    inReview: number;
    approved: number;
    total: number;
  };
  performance: {
    totalViews: number;
    avgEngagement: string;
    topPost: string;
  };
  kanban: {
    totalTasks: number;
    inProgress: number;
    completed: number;
  };
  notifications: { id: string; message: string; date: string }[];
  todaySchedule: { id: string; title: string; time: string }[];
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "meeting" | "deadline" | "publish" | "other";
  description?: string;
}
