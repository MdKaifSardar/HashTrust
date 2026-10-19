import React, { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentStep } from "@/redux/features/signUpSteps/stepSlice";
import ThemeToggle from "@/components/ThemeToggle";

// Custom tailless arrow icon
const TaillessArrowLeft = () => (
  <svg
    width={24}
    height={24}
    stroke="currentColor"
    fill="none"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="inline-block"
  >
    <path
      d="M15 5l-7 7 7 7"
      strokeLinecap="butt"
      strokeLinejoin="round"
    />
  </svg>
);

const steps = [
  { label: "ID Document" },
  { label: "Extract Data" },
  { label: "User Images" },
  { label: "Face Similarity" },
  { label: "Email and Password" },
  { label: "Review Data" },
];

const MobileTopProgressBar: React.FC = () => {
  const currentStep = useSelector(selectCurrentStep);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  // Helper to handle mobile click/tap
  const handleBlobClick = (idx: number) => {
    if (activeTooltip === idx) setActiveTooltip(null);
    else setActiveTooltip(idx);
  };

  return (
    <div className="sm:hidden w-full flex flex-col items-center pt-4 pb-2 bg-blue-50 dark:bg-slate-900 border-b border-blue-100 dark:border-slate-800 overflow-x-hidden transition-colors">
      <div className="w-full flex items-center justify-between px-4 mb-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-sm group relative transition-all duration-150 active:scale-95 px-3 py-1.5 rounded-full bg-blue-900 dark:bg-slate-800 text-white shadow hover:bg-blue-800 dark:hover:bg-slate-700"
          style={{ userSelect: "none" }}
        >
          <span className="text-lg text-white">
            <TaillessArrowLeft />
          </span>
          <span className="text-white">Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>
      {/* Responsive progress bar */}
      <div className="w-full flex items-center justify-center px-2 overflow-x-auto">
        <div className="flex items-center justify-center w-full gap-2">
          {steps.map((step, idx) => (
            <div
              key={step.label}
              className="relative group flex flex-col items-center"
              // Show tooltip on hover for desktop, on click for mobile
              onMouseEnter={() => window.innerWidth > 640 && setActiveTooltip(idx)}
              onMouseLeave={() => window.innerWidth > 640 && setActiveTooltip(null)}
              onClick={() => window.innerWidth <= 640 && handleBlobClick(idx)}
              style={{ minWidth: 0 }}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full border-2 transition-colors
                  ${
                    idx <= currentStep
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-200 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-500 dark:text-slate-400"
                  }
                `}
                style={{
                  minWidth: 28,
                  minHeight: 28,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {idx + 1}
              </div>
              {/* Tooltip for step label */}
              {activeTooltip === idx && (
                <span
                  className="absolute z-10 px-2 py-1 rounded bg-blue-700 dark:bg-slate-800 text-white text-xs font-medium shadow whitespace-nowrap border border-transparent dark:border-slate-700"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    bottom: "110%",
                    minWidth: "max-content",
                    maxWidth: "160px",
                    textAlign: "center",
                  }}
                >
                  {step.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileTopProgressBar;
