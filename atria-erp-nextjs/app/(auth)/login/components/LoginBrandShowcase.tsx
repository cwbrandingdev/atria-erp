import { Sparkles, TrendingUp, Users } from "lucide-react";

export function LoginBrandShowcase() {
  return (
    <div className="relative hidden h-full overflow-hidden bg-[#004949] lg:flex lg:flex-col lg:justify-between">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(232,195,158,0.35) 0%, transparent 42%),
            radial-gradient(circle at 80% 0%, rgba(232,195,158,0.18) 0%, transparent 35%),
            linear-gradient(135deg, rgba(0,73,73,1) 0%, rgba(0,49,49,1) 55%, rgba(0,73,73,1) 100%)
          `,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,195,158,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(232,195,158,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="login-orb pointer-events-none absolute -left-16 top-24 size-64 rounded-full bg-[#E8C39E]/20 blur-3xl" />
      <div className="login-orb-delayed pointer-events-none absolute bottom-16 right-0 size-80 rounded-full bg-[#E8C39E]/15 blur-3xl" />
      <div className="login-orb pointer-events-none absolute left-1/3 top-1/2 size-40 rounded-full bg-emerald-300/10 blur-2xl" />

      <div className="login-float-delayed pointer-events-none absolute right-16 top-28 size-24 rounded-3xl border border-[#E8C39E]/20 bg-white/5 backdrop-blur-sm" />
      <div className="login-float pointer-events-none absolute left-20 top-1/3 size-16 rotate-12 rounded-full border border-[#E8C39E]/25" />
      <div className="login-pulse-ring pointer-events-none absolute left-1/2 top-1/4 size-32 rounded-full border border-[#E8C39E]/20" />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-12 xl:px-16">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#E8C39E]/25 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#E8C39E] backdrop-blur-sm">
          <Sparkles className="size-3.5" />
          Plataforma para agências de alto desempenho
        </div>

        <h2 className="max-w-lg text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
          Gestão inteligente para agências e estúdios de alto impacto
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/60">
          Centralize clientes, conteúdo, finanças e operações em um único
          workspace elegante — projetado para equipes criativas que precisam de
          velocidade e clareza.
        </p>

        <div className="login-float mt-12 w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E8C39E]">
              Resultados em tempo real
            </span>
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              +38% eficiência
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-[#004949]/40 p-3">
              <div className="mb-2 flex items-center gap-2 text-[#E8C39E]">
                <TrendingUp className="size-4" />
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  Entregas
                </span>
              </div>
              <p className="text-2xl font-bold text-white">94%</p>
              <p className="text-[11px] text-white/45">no prazo este mês</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#004949]/40 p-3">
              <div className="mb-2 flex items-center gap-2 text-[#E8C39E]">
                <Users className="size-4" />
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  Clientes
                </span>
              </div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-[11px] text-white/45">ativos na carteira</p>
            </div>
          </div>

          <blockquote className="mt-4 border-l-2 border-[#E8C39E]/50 pl-3 text-sm italic text-white/70">
            &ldquo;O ATRIA transformou nossa rotina de aprovações e entregas.&rdquo;
          </blockquote>
          <p className="mt-1 text-xs text-white/40">— Estúdio Criativo, São Paulo</p>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 px-12 py-6 text-xs text-white/35 xl:px-16">
        © {new Date().getFullYear()} ATRIA ERP · Todos os direitos reservados
      </div>
    </div>
  );
}
