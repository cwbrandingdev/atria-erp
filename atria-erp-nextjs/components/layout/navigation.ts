import {
  LayoutDashboard,
  Kanban,
  Calendar,
  FileText,
  ClipboardList,
  Timer,
  FolderOpen,
  Users,
  FileSignature,
  Settings,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavChild {
  name: string;
  href: string;
}

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: NavChild[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    label: "VISÃO GERAL",
    items: [
      {
        name: "Dashboards",
        href: "/dashboard",
        icon: LayoutDashboard,
        children: [
          { name: "Resumo / Dashboard Principal", href: "/dashboard" },
          { name: "Dashboard Financeiro", href: "/financial" },
          { name: "Dashboard de Criação de Conteúdo", href: "/content" },
          { name: "Dashboard Meta Insights", href: "/insights" },
        ],
      },
    ],
  },
  {
    label: "OPERAÇÃO",
    items: [
      { name: "Kanban", href: "/kanban", icon: Kanban },
      { name: "Timesheet", href: "/timesheet", icon: Timer },
      { name: "Calendário", href: "/calendar", icon: Calendar },
      { name: "Clientes", href: "/clients", icon: Users },
      { name: "Assets", href: "/assets", icon: FolderOpen },
    ],
  },
  {
    label: "GESTÃO & FINANCEIRO",
    items: [
      { name: "Financeiro", href: "/financial", icon: Wallet },
      { name: "Contratos", href: "/contracts", icon: FileSignature },
      { name: "Relatórios", href: "/reports", icon: ClipboardList },
      { name: "Resumos", href: "/resumos", icon: FileText },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      {
        name: "Configurações",
        href: "/settings",
        icon: Settings,
        children: [
          { name: "Aparência", href: "/settings/appearance" },
          { name: "Usuários", href: "/settings/users" },
        ],
      },
    ],
  },
];

/** @deprecated Use navSections — kept for breadcrumb/search utilities */
export const navigation: NavItem[] = navSections.flatMap((section) => section.items);

export const dashboardRoutes =
  navigation
    .find((item) => item.name === "Dashboards")
    ?.children?.map((child) => child.href) ?? [];

export const settingsRoutes =
  navigation
    .find((item) => item.name === "Configurações")
    ?.children?.map((child) => child.href) ?? [];
