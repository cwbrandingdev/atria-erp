"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  GalleryVerticalEndIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menu = [
  {
    name: "Início",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Kanban",
    href: "/kanban",
    icon: Kanban,
  },
  {
    name: "Agenda",
    href: "/agenda",
    icon: Calendar,
  },
  {
    name: "Dashboards",
    href: "",
    icon: GalleryVerticalEndIcon,
    children: [
      { name: "Financeiro", href: "/financeiro/visao-geral" },
      { name: "Criação", href: "/financeiro/entradas" },
      { name: "Performance", href: "/financeiro/saidas" },
      { name: "Insight", href: "/financeiro/saidas" },
    ],
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
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>("Financeiro");

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col bg-[#004C4C] px-6 py-8 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">My Dashboard</h1>
        <span className="text-xs font-medium text-[#E8C39E]">Admin Panel</span>
      </div>

      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.children && item.children.length > 0);
          const isOpen = openDropdown === item.name;
          const active =
            pathname === item.href ||
            (hasChildren && item.children?.some((child) => child.href === pathname));

          if (hasChildren) {
            return (
              <div key={item.name} className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => toggleDropdown(item.name)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#E8C39E] text-[#004C4C]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="ml-9 flex flex-col gap-1 border-l border-white/10 pl-3">
                    {item.children?.map((child) => {
                      const childActive = pathname === child.href;

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                            childActive
                              ? "bg-white/20 text-white font-semibold"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#E8C39E] text-[#004C4C]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/20">
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback className="bg-[#E8C39E] text-[#004C4C] font-semibold">
                TS
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">Teste</span>
              <span className="text-xs text-[#E8C39E]">Designer Gráfico</span>
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}