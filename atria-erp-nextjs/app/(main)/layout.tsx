import { Sidebar } from "@/components/ui/shared/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Sidebar />

      <main
        className="
ml-72
p-8
"
      >
        {children}
      </main>
    </div>
  );
}
