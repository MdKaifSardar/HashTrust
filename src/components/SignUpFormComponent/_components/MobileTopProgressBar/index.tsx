"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentStep } from "@/redux/features/signUpSteps/stepSlice";
import ThemeToggle from "@/components/ThemeToggle";
import { FiArrowLeft, FiShield } from "react-icons/fi";

const steps = [
  "ID Document",
  "Extract Data",
  "User Images",
  "Face Similarity",
  "Credentials",
  "Review & Mint",
];

export const MobileTopProgressBar: React.FC = () => {
  const currentStep = useSelector(selectCurrentStep);

  return (
    <div className="sm:hidden w-full flex flex-col pt-4 pb-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200/80 dark:border-white/10 sticky top-0 z-30 transition-colors">
      <div className="w-full flex items-center justify-between px-4 mb-2.5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 transition-colors"
        >
          <FiArrowLeft size={16} />
          <span>Exit</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sky-600 text-white flex items-center justify-center text-xs">
            <FiShield size={12} />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            HashTrust
          </span>
        </div>
        <ThemeToggle />
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between text-[11px] font-semibold mb-1 text-slate-500 dark:text-slate-400">
          <span className="text-sky-600 dark:text-sky-400">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-slate-700 dark:text-slate-200">
            {steps[currentStep]}
          </span>
        </div>
        {/* Segmented bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep ? "bg-sky-500" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileTopProgressBar;
