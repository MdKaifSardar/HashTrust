"use client";

import React from "react";
import { FiCheck } from "react-icons/fi";

export interface StepItem {
  id: number;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Mobile view: Simple progress indicator */}
      <div className="flex md:hidden items-center justify-between mb-4 px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          Step {currentStep} of {steps.length}
        </span>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {steps.find((s) => s.id === currentStep)?.title}
        </span>
      </div>
      <div className="md:hidden w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-sky-500 h-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      {/* Desktop view: Step-by-step timeline */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-white/10 -z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-sky-500 transition-all duration-300 -z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10 group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 border-2 ${
                  isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/25"
                    : isCurrent
                    ? "bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-600/30 ring-4 ring-sky-500/20 dark:ring-sky-400/20"
                    : "bg-white dark:bg-slate-900 border-slate-300 dark:border-white/20 text-slate-400"
                }`}
              >
                {isCompleted ? <FiCheck size={18} /> : step.id}
              </div>
              <span
                className={`mt-2 text-xs font-semibold text-center max-w-[100px] transition-colors ${
                  isCurrent
                    ? "text-sky-600 dark:text-sky-400"
                    : isCompleted
                    ? "text-slate-800 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
