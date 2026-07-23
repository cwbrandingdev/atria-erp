"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  dashboardRoutes,
  navSections,
  settingsRoutes,
} from "./navigation";

interface SidebarNavProps {
  onNavigate?: () => void;
  className?: string;
}

function isRouteActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ onNavigate, className }: SidebarNavProps) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  useEffect(() => {
    const next = new Set<string>();

    if (dashboardRoutes.some((href) => isRouteActive(pathname, href))) {
      next.add("Dashboards");
    }

    if (settingsRoutes.some((href) => isRouteActive(pathname, href))) {
      next.add("Configurações");
    }

    setOpenDropdowns(next);
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <nav className={cn("flex flex-col gap-6", className)}>
      {navSections.map((section) => (
        <div key={section.label}>
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] text-white/35">
            {section.label}
          </p>

          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const hasChildren = Boolean(item.children?.length);
              const isOpen = openDropdowns.has(item.name);
              const active =
                isRouteActive(pathname, item.href) ||
                (hasChildren &&
                  item.children?.some((child) =>
                    isRouteActive(pathname, child.href),
                  ));

              if (hasChildren) {
                return (
                  <div key={item.name} className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.name)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                        active
                          ? "border-l-4 border-[#E8C39E] bg-white/10 pl-2.5 text-white"
                          : "border-l-4 border-transparent text-white/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={cn(
                            "shrink-0 transition-colors",
                            active
                              ? "text-[#E8C39E]"
                              : "text-white/50 group-hover:text-white/80",
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "text-white/40 transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div className="relative ml-5 flex flex-col gap-0.5 border-l border-white/10 py-1 pl-3">
                        {item.children?.map((child) => {
                          const childActive = isRouteActive(
                            pathname,
                            child.href,
                          );

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onNavigate}
                              className={cn(
                                "rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-150",
                                childActive
                                  ? "bg-white/10 text-[#E8C39E]"
                                  : "text-white/55 hover:bg-white/5 hover:text-white/90",
                              )}
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
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    active
                      ? "border-l-4 border-[#E8C39E] bg-white/10 pl-2.5 text-white"
                      : "border-l-4 border-transparent text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(
                      "shrink-0 transition-colors",
                      active
                        ? "text-[#E8C39E]"
                        : "text-white/50 group-hover:text-white/80",
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
