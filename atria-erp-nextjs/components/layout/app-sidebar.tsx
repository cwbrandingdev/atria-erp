"use client";

import { SidebarNav } from "./sidebar-nav";
import { SidebarUserProfile } from "./sidebar-user-profile";

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col bg-[var(--atria-primary)] text-white lg:flex">
      <div className="border-b border-white/10 px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight">ATRIA</h1>
        <span className="text-xs font-medium text-[var(--atria-accent)]">
          Admin Panel
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <SidebarNav />
      </div>

      <SidebarUserProfile />
    </aside>
  );
}
