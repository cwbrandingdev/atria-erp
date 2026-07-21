import { Card } from "@/components/ui/card";
import {
  BoltIcon,
  CheckIcon,
  FlagIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react";

interface CardsInterface {
  id: number;
  name: string;
  value: number;
  icon: LucideIcon;
}

export default function ResumeCards() {
  const cards: CardsInterface[] = [
    { id: 1, name: "Em produção", value: 0, icon: BoltIcon },
    { id: 2, name: "Ajustes", value: 0, icon: TriangleAlertIcon },
    { id: 3, name: "Aprovadas", value: 0, icon: CheckIcon },
    { id: 4, name: "Total", value: 0, icon: FlagIcon },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.id}
            className="p-4 my-4 flex items-start gap-4 bg-white rounded-2xl border"
          >
            <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {card.value}
              </span>
              <p className="text-sm text-slate-500 font-medium">{card.name}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
