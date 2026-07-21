import { CalendarIcon } from "lucide-react";

export default function TodaySchedule() {
  return (
    <div className="w-full max-w-4xl min-h-[16rem] rounded-3xl border border-slate-100 bg-white p-6 shadow-sm mb-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-semibold text-slate-800">
            Agenda de hoje
          </h1>
        </div>

        <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
          Ver agenda completa
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-8 text-center my-auto">
        <div className="p-4 bg-slate-50 rounded-full text-slate-400 mb-3">
          <CalendarIcon className="w-8 h-8 stroke-[1.5]" />
        </div>
        <p className="text-sm font-medium text-slate-500">
          Nenhum compromisso para hoje
        </p>
      </div>
    </div>
  );
}
