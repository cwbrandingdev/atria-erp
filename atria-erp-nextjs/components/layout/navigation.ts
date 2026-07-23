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
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: { name: string; href: string }[];
}

export const navigation: NavItem[] = [
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
  {
    name: "Kanban",
    href: "/kanban",
    icon: Kanban,
  },
  {
    name: "Timesheet",
    href: "/timesheet",
    icon: Timer,
  },
  {
    name: "Calendário",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Clientes",
    href: "/clients",
    icon: Users,
  },
  {
    name: "Assets",
    href: "/assets",
    icon: FolderOpen,
  },
  {
    name: "Contratos",
    href: "/contracts",
    icon: FileSignature,
  },
  {
    name: "Relatórios",
    href: "/reports",
    icon: ClipboardList,
  },
  {
    name: "Resumos",
    href: "/resumos",
    icon: FileText,
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
    children: [
      { name: "Aparência", href: "/settings/appearance" },
      { name: "Usuários", href: "/settings/users" },
    ],
  },
];

export const dashboardRoutes = navigation
  .find((item) => item.name === "Dashboards")
  ?.children?.map((child) => child.href) ?? [];
