"use client";

import React from "react";
import UploadIDComp from "../SignUpSteps/UploadIDComp";
import DataExtractDocComp from "../SignUpSteps/DataExtractDocComp";
import { useSelector } from "react-redux";
import { selectCurrentStep } from "../../redux/features/signUpSteps/stepSlice";

const steps = [
  { label: "Identity Document" },
  { label: "Extract Data" },
  // Add more steps here as you implement them
];

const SignUpFormComponent: React.FC = () => {
  const currentStep = useSelector(selectCurrentStep);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center mb-8">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  idx <= currentStep
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-gray-200 border-gray-300 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  idx <= currentStep ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-1 bg-gray-300 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {currentStep === 0 && <UploadIDComp />}
        {currentStep === 1 && <DataExtractDocComp />}
        {/* Add more steps here as you implement them */}
      </div>
    </div>
  );
};

export default SignUpFormComponent;