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

const SideProgressMenu: React.FC = () => {
  const currentStep = useSelector(selectCurrentStep);
  const [hovered, setHovered] = useState(false);

  return (
    <aside className="hidden sm:flex flex-col items-center bg-blue-50 border-r border-blue-100 shadow-md rounded-none py-10 px-4 h-screen fixed top-0 left-0 z-20 w-[30%] lg:w-[20%] min-w-[20%]">
      <div
        className="mb-8 flex flex-col items-center group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link href="/" className="flex items-center justify-center relative">
          <span
            className={`transition-all duration-200 text-3xl rounded-full p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 shadow hover:shadow-lg`}
          >
            <FiArrowLeft />
          </span>
          {hovered && (
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded shadow transition-all duration-200 whitespace-nowrap">
              Back to Home
            </span>
          )}
        </Link>
      </div>
      <h3 className="flex items-center text-blue-700 font-semibold text-xl mb-[1rem] text-center">
        Sign Up Steps
      </h3>
      <ul className="flex flex-col gap-2 w-full">
        {steps.map((step: { label: string }, idx: number) => (
          <li key={step.label}>
            <button
              type="button"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-semibold
                ${
                  idx === currentStep
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-blue-700 hover:bg-blue-100"
                }
                border border-blue-100`}
              disabled
            >
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full border-2
                  ${
                    idx === currentStep
                      ? "bg-white border-blue-600 text-blue-600 font-bold"
                      : "bg-blue-100 border-blue-200 text-blue-400"
                  }`}
              >
                {idx + 1}
              </span>
              <span className="text-base">{step.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideProgressMenu;
