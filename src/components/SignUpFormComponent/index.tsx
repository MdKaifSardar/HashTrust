"use client";

import React from "react";
import UploadIDComp from "../SignUpSteps/UploadIDComp";
import DataExtractDocComp from "../SignUpSteps/DataExtractDocComp";
import BiometricVerificationComp from "../SignUpSteps/BiometricVerificationComp";
import CreatePasswordComp from "../SignUpSteps/CreatePasswordComp";
import ReviewDataComp from "../SignUpSteps/ReviewDataComp";
import { useSelector } from "react-redux";
import { selectCurrentStep } from "../../redux/features/signUpSteps/stepSlice";
import SideProgressMenu from "./_components/SideProgressMenu";
import MobileTopProgressBar from "./_components/MobileTopProgressBar";

export const SignUpFormComponent: React.FC = () => {
  const currentStep = useSelector(selectCurrentStep);

  return (
    <div className="w-full min-h-screen flex flex-col sm:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* SideProgressMenu: fixed on desktop */}
      <SideProgressMenu />
      <MobileTopProgressBar />

      {/* Main Step Workspace */}
      <main className="flex-1 ml-0 sm:ml-[30%] lg:ml-[22%] w-full sm:w-[calc(100%-30%)] lg:w-[calc(100%-22%)] min-h-screen p-3 xs:p-4 sm:p-8 lg:p-12 pb-24 sm:pb-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-2xl glass-panel-elevated p-4 xs:p-6 sm:p-10 rounded-2xl sm:rounded-3xl relative">
          {currentStep === 0 && <UploadIDComp />}
          {currentStep === 1 && <DataExtractDocComp />}
          {currentStep === 2 && <BiometricVerificationComp />}
          {currentStep === 3 && <CreatePasswordComp />}
          {currentStep === 4 && <ReviewDataComp />}
        </div>
      </main>
    </div>
  );
};

export default SignUpFormComponent;
