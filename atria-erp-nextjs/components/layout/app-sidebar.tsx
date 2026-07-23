"use client";

import { SidebarBrand } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUserProfile } from "./sidebar-user-profile";

export function AppSidebar() {
  return (
    <aside className="sidebar-scroll sticky top-0 hidden h-screen w-[17.5rem] shrink-0 flex-col border-r border-white/5 bg-gradient-to-b from-[#004949] via-[#004040] to-[#003535] text-white lg:flex">
      <div className="shrink-0 border-b border-white/8 px-4 py-5">
        <SidebarBrand />
      </div>

      <div className="sidebar-scroll flex-1 overflow-y-auto px-2 py-4">
        <SidebarNav />
      </div>

      <SidebarUserProfile />
    </aside>
  );
}
