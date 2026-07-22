"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskTimer } from "@/components/kanban/task-timer";
import {
  getInitials,
  PRIORITY_BADGE_STYLES,
  PRIORITY_CARD_STYLES,
  PRIORITY_LABELS,
} from "@/lib/kanban-utils";
import type { KanbanTask, TimeLog } from "@/services/types";

interface TaskCardProps {
  task: KanbanTask;
  activeTimer: TimeLog | null;
  onClick: () => void;
  onTimerUpdate: () => void;
}

export function TaskCard({
  task,
  activeTimer,
  onClick,
  onTimerUpdate,
}: TaskCardProps) {
  return (
    <div
      className={`w-full rounded-xl border p-3 text-left shadow-sm transition-all hover:shadow-md ${PRIORITY_CARD_STYLES[task.priority]}`}
    >
      <button type="button" onClick={onClick} className="w-full text-left">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-[var(--atria-primary)]">
            {task.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_BADGE_STYLES[task.priority]}`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>

        {task.client && (
          <p className="mb-2 text-[10px] text-[var(--atria-primary)]/50">
            {task.client.companyName}
          </p>
        )}
      </button>

      <div className="flex items-center justify-between gap-2">
        {task.assignees.length > 0 ? (
          <TooltipProvider>
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((assignee) => (
                <Tooltip key={assignee.id}>
                  <TooltipTrigger
                    render={
                      <Avatar className="size-7 border-2 border-white" />
                    }
                  >
                    {assignee.avatarUrl && (
                      <AvatarImage
                        src={assignee.avatarUrl}
                        alt={assignee.name}
                      />
                    )}
                    <AvatarFallback className="bg-[var(--atria-accent)] text-[9px] font-semibold text-[var(--atria-primary)]">
                      {getInitials(assignee.name)}
                    </AvatarFallback>
                  </TooltipTrigger>
                  <TooltipContent>{assignee.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        ) : (
          <span />
        )}
        <TaskTimer
          taskId={task.id}
          totalLoggedSeconds={task.totalLoggedSeconds}
          activeTimer={activeTimer}
          compact
          onUpdate={onTimerUpdate}
        />
      </div>
    </div>
  );
}
