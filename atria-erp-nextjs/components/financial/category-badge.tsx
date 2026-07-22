"use client";

import { cn } from "@/lib/utils";
import { getContrastColor } from "@/lib/financial-utils";

interface CategoryBadgeProps {
  name: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CategoryBadge({
  name,
  color,
  selected,
  onClick,
  className,
}: CategoryBadgeProps) {
  const textColor = getContrastColor(color);
  const Component = onClick ? "button" : "span";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all",
        onClick && "cursor-pointer hover:scale-105",
        selected
          ? "border-[var(--atria-primary)] ring-2 ring-[var(--atria-primary)]/30"
          : "border-transparent",
        className,
      )}
      style={{
        backgroundColor: color,
        color: textColor,
      }}
    >
      {name}
    </Component>
  );
}
