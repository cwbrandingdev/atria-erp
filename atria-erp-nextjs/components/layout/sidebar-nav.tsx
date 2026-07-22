"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardRoutes, navigation } from "./navigation";

interface SidebarNavProps {
  onNavigate?: () => void;
  className?: string;
}

function isRouteActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ onNavigate, className }: SidebarNavProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onDashboardRoute = dashboardRoutes.some((href) =>
      isRouteActive(pathname, href),
    );

    if (onDashboardRoute) {
      setOpenDropdown("Dashboards");
    }
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {navigation.map((item) => {
        const Icon = item.icon;
        const hasChildren = Boolean(item.children?.length);
        const isOpen = openDropdown === item.name;
        const active =
          isRouteActive(pathname, item.href) ||
          (hasChildren &&
            item.children?.some((child) => isRouteActive(pathname, child.href)));

        if (hasChildren) {
          return (
            <div key={item.name} className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => toggleDropdown(item.name)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--atria-accent)] text-[var(--atria-primary)]"
                    : "text-white/80 hover:bg-white/10 hover:text-[var(--atria-accent)]",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span>{item.name}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {isOpen && (
                <div className="ml-4 flex flex-col gap-1 border-l border-[var(--atria-accent)]/30 pl-3">
                  {item.children?.map((child) => {
                    const childActive = isRouteActive(pathname, child.href);

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={cn(
                          "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                          childActive
                            ? "bg-[var(--atria-accent)] font-semibold text-[var(--atria-primary)]"
                            : "text-white/70 hover:bg-white/10 hover:text-[var(--atria-accent)]",
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
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--atria-accent)] text-[var(--atria-primary)]"
                : "text-white/80 hover:bg-white/10 hover:text-[var(--atria-accent)]",
            )}
          >
            <Icon size={20} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
