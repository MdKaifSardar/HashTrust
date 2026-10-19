"use client";

import React from "react";
import Link from "next/link";
import { FiArrowLeft, FiCheck, FiShield } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectCurrentStep } from "@/redux/features/signUpSteps/stepSlice";
import ThemeToggle from "@/components/ThemeToggle";

const steps = [
  { label: "ID Document", desc: "Upload official ID" },
  { label: "Extract Data", desc: "OCR text verification" },
  { label: "Biometrics", desc: "Liveness & ID face match" },
  { label: "Credentials", desc: "Email and password" },
  { label: "Review & Mint", desc: "Smart contract proof" },
];

export const SideProgressMenu: React.FC = () => {
  const currentStep = useSelector(selectCurrentStep);

  return (
    <aside className="hidden sm:flex flex-col justify-between bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-white/10 p-6 h-screen fixed top-0 left-0 z-20 w-[30%] lg:w-[22%] min-w-[260px] transition-colors">
      <div className="w-full flex flex-col">
        {/* Header with Back button & Brand */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 dark:border-white/10 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <FiArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <div className="w-7 h-7 rounded-lg bg-sky-600 dark:bg-sky-500 flex items-center justify-center text-white dark:text-slate-950 shadow-sm">
            <FiShield size={14} />
          </div>
        </div>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Onboarding Protocol
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            Identity Verification
          </h3>
        </div>

        {/* Vertical Step Timeline */}
        <div className="flex flex-col gap-1 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={step.label}
                className={`flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-200 ${
                  isCurrent
                    ? "bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/40 shadow-sm"
                    : isCompleted
                    ? "text-slate-700 dark:text-slate-300"
                    : "text-slate-400 dark:text-slate-600"
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                    isCompleted
                      ? "bg-emerald-500 text-white shadow-sm"
                      : isCurrent
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-white/10"
                  }`}
                >
                  {isCompleted ? <FiCheck size={14} /> : idx + 1}
                </div>

                {/* Step Label & Subtitle */}
                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold truncate ${
                      isCurrent
                        ? "text-sky-900 dark:text-sky-200"
                        : isCompleted
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom theme switch */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Theme Mode
        </span>
        <ThemeToggle />
      </div>
    </aside>
  );
};

export default SideProgressMenu;
