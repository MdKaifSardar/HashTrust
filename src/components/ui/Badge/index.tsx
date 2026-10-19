"use client";

import React from "react";

export type BadgeVariant = "verified" | "live" | "pending" | "danger" | "neutral" | "info";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  withDot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  verified: {
    container:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  live: {
    container:
      "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20 dark:border-sky-500/30",
    dot: "bg-sky-500",
  },
  pending: {
    container:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30",
    dot: "bg-amber-500",
  },
  danger: {
    container:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/30",
    dot: "bg-rose-500",
  },
  neutral: {
    container:
      "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20 dark:border-slate-500/30",
    dot: "bg-slate-400",
  },
  info: {
    container:
      "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 dark:border-indigo-500/30",
    dot: "bg-indigo-500",
  },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  withDot = true,
  size = "md",
  className = "",
}) => {
  const { container, dot } = variantStyles[variant];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1 font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${container} ${sizeClass} tracking-wide transition-colors ${className}`}
    >
      {withDot && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dot}`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dot}`} />
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
