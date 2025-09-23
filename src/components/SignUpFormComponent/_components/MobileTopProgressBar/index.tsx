import React, { useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectCurrentStep } from "@/redux/features/signUpSteps/stepSlice";

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
  const [hovered, setHovered] = useState(false);

  return (
    <div className="sm:hidden w-full flex flex-col items-center pt-6 pb-2 bg-blue-50 border-b border-blue-100">
      <Link
        href="/"
        className="mb-4 flex items-center gap-2 text-blue-700 hover:text-cyan-500 font-semibold text-base group relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="text-xl">
          <FiArrowLeft />
        </span>
        {hovered && (
          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded shadow transition-all duration-200 whitespace-nowrap">
            Back to Home
          </span>
        )}
      </Link>
      <div className="flex items-center w-full justify-center gap-2">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${
                  idx <= currentStep
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-gray-200 border-gray-300 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`mt-1 text-xs font-medium text-center ${
                  idx <= currentStep ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-6 h-1 bg-gray-300 mx-1 rounded" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MobileTopProgressBar;
