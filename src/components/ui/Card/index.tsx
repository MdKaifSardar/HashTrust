"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  variant?: "default" | "glass" | "elevated" | "interactive";
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const variantClass = {
    default:
      "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm rounded-2xl",
    glass:
      "glass-panel rounded-2xl shadow-sm dark:shadow-slate-950/50",
    elevated:
      "glass-panel-elevated rounded-2xl",
    interactive:
      "bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 hover:border-sky-500/50 dark:hover:border-sky-400/40 shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-200 rounded-2xl cursor-pointer",
  }[variant];

  return (
    <motion.div
      className={`${variantClass} p-5 sm:p-6 text-slate-900 dark:text-slate-100 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  isPositive,
  icon,
  description,
  className = "",
}) => {
  return (
    <div
      className={`glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50">
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {value}
        </div>
        {(change || description) && (
          <div className="flex items-center gap-2 mt-2 text-xs">
            {change && (
              <span
                className={`font-semibold px-1.5 py-0.5 rounded ${
                  isPositive
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
                    : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
                }`}
              >
                {isPositive ? "+" : ""}
                {change}
              </span>
            )}
            {description && (
              <span className="text-slate-500 dark:text-slate-400">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
