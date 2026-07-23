"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/time-utils";
import { timesheetService } from "@/services";
import type { TimeLog } from "@/services/types";

export function ActiveTimerBadge() {
  const [activeTimer, setActiveTimer] = useState<TimeLog | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [stopping, setStopping] = useState(false);

  const loadTimer = useCallback(async () => {
    try {
      const timer = await timesheetService.getActiveTimer();
      setActiveTimer(timer);
    } catch {
      setActiveTimer(null);
    }
  }, []);

  useEffect(() => {
    void loadTimer();
    const interval = setInterval(() => void loadTimer(), 30_000);
    return () => clearInterval(interval);
  }, [loadTimer]);

  useEffect(() => {
    if (!activeTimer?.isRunning) {
      setElapsed(activeTimer?.elapsedSeconds ?? 0);
      return;
    }

    const tick = () => {
      const start = new Date(activeTimer.startTime).getTime();
      setElapsed(Math.floor((Date.now() - start) / 1000));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  if (!activeTimer) return null;

  async function handleStop(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!activeTimer) return;
    setStopping(true);
    try {
      await timesheetService.stopTimer(activeTimer.taskId);
      setActiveTimer(null);
    } finally {
      setStopping(false);
    }
  }

  return (
    <Link
      href="/timesheet"
      className="group flex items-center gap-2 rounded-full border border-[var(--atria-accent)]/40 bg-[var(--atria-accent)]/15 px-3 py-1.5 transition-all hover:bg-[var(--atria-accent)]/25"
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <Clock className="size-3.5 text-[var(--atria-primary)]" />
      <div className="hidden min-w-0 sm:block">
        <p className="max-w-[120px] truncate text-[10px] font-medium text-[var(--atria-primary)]/60">
          {activeTimer.task.title}
        </p>
        <p className="font-mono text-xs font-semibold tabular-nums text-[var(--atria-primary)]">
          {formatDuration(elapsed)}
        </p>
      </div>
      <span className="font-mono text-xs font-semibold tabular-nums text-[var(--atria-primary)] sm:hidden">
        {formatDuration(elapsed)}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={stopping}
        onClick={handleStop}
        className="size-6 shrink-0 text-[var(--atria-primary)]/60 hover:bg-[var(--atria-primary)]/10 hover:text-[var(--atria-primary)]"
        aria-label="Parar timer"
      >
        <Pause className="size-3" />
      </Button>
    </Link>
  );
}
