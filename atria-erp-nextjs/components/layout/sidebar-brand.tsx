export function SidebarBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8C39E] to-[#d4a574] shadow-lg shadow-black/20 ring-1 ring-white/20">
        <span className="text-lg font-black tracking-tighter text-[#004949]">A</span>
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#004949] bg-emerald-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-white">ATRIA</h1>
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#E8C39E] ring-1 ring-white/10">
            PROD
          </span>
        </div>
        <p className="truncate text-[11px] font-medium text-white/45">
          Atria ERP · Workspace
        </p>
      </div>
    </div>
  );
}
