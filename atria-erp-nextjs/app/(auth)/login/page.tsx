import { LoginBrandShowcase } from "./components/LoginBrandShowcase";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <LoginBrandShowcase />

      <div className="relative flex min-h-svh flex-col bg-[#f7fafa]">
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,73,73,0.08) 0%, transparent 28%)",
          }}
        />

        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8C39E] to-[#d4a574] shadow-md">
                <span className="text-sm font-black text-[#004949]">A</span>
              </div>
              <span className="text-base font-bold text-[var(--atria-primary)]">
                ATRIA ERP
              </span>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
