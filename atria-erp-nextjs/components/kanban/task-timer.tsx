"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/time-utils";
import { timesheetService } from "@/services";
import type { TimeLog } from "@/services/types";

interface TaskTimerProps {
  taskId: string;
  totalLoggedSeconds: number;
  activeTimer: TimeLog | null;
  compact?: boolean;
  onUpdate?: () => void;
}

export function TaskTimer({
  taskId,
  totalLoggedSeconds,
  activeTimer,
  compact = false,
  onUpdate,
}: TaskTimerProps) {
  const isRunning = activeTimer?.taskId === taskId;
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isRunning || !activeTimer) {
      setElapsed(0);
      return;
    }

    const tick = () => {
      const start = new Date(activeTimer.startTime).getTime();
      setElapsed(Math.floor((Date.now() - start) / 1000));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, activeTimer]);

  const displaySeconds = isRunning
    ? totalLoggedSeconds + elapsed
    : totalLoggedSeconds;

  const handleToggle = useCallback(async () => {
    setLoading(true);
    try {
      if (isRunning) {
        await timesheetService.stopTimer(taskId);
      } else {
        await timesheetService.startTimer(taskId);
      }
      onUpdate?.();
    } finally {
      setLoading(false);
    }
  }, [isRunning, taskId, onUpdate]);

  if (compact) {
    return (
      <div
        className="flex items-center gap-1"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {displaySeconds > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-[var(--atria-primary)]/60">
            <Clock className="size-3" />
            {formatDuration(displaySeconds)}
          </span>
        )}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={`size-6 shrink-0 ${isRunning ? "text-red-600" : "text-[var(--atria-primary)]"}`}
          onClick={(e) => {
            e.stopPropagation();
            void handleToggle();
          }}
          disabled={loading}
        >
          {isRunning ? <Pause className="size-3" /> : <Play className="size-3" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--atria-primary)]/10 bg-[var(--atria-primary)]/5 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--atria-primary)]/50">
            Tempo registrado
          </p>
          <p className="text-2xl font-bold tabular-nums text-[var(--atria-primary)]">
            {formatDuration(displaySeconds)}
          </p>
          {isRunning && (
            <p className="text-xs text-red-600">Timer em execução</p>
          )}
        </div>
        <Button
          type="button"
          onClick={() => void handleToggle()}
          disabled={loading}
          className={
            isRunning
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
          }
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 size-4" />
              Pausar Timer
            </>
          ) : (
            <>
              <Play className="mr-2 size-4" />
              Iniciar Timer
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
