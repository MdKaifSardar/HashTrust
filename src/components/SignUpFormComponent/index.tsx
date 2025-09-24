"use client";

import React from "react";
import UploadIDComp from "../SignUpSteps/UploadIDComp";
import DataExtractDocComp from "../SignUpSteps/DataExtractDocComp";
import TakeUserImagesComp from "../SignUpSteps/TakeUserImagesComp";
import FaceSimilarityCheck from "../SignUpSteps/FaceSimilarityCheck";
import CreatePasswordComp from "../SignUpSteps/CreatePasswordComp";
import ReviewDataComp from "../SignUpSteps/ReviewDataComp";
import { useSelector } from "react-redux";
import { selectCurrentStep } from "../../redux/features/signUpSteps/stepSlice";
import { ToastContainer } from "react-toastify";
import SideProgressMenu from "./_components/SideProgressMenu";
import MobileTopProgressBar from "./_components/MobileTopProgressBar";

const steps = [
  { label: "ID Document" },
  { label: "Extract Data" },
  { label: "User Images" },
  { label: "Face Similarity" },
  { label: "Email and Password" },
  { label: "Review Data" },
];

const SignUpFormComponent: React.FC = () => {
  const currentStep = useSelector(selectCurrentStep);

  return (
    <div className="w-full h-full flex flex-col sm:flex-row bg-gray-100">
      {/* SideProgressMenu: fixed position, 20% width on desktop */}
      <SideProgressMenu />
      <MobileTopProgressBar />
      {/* Step Content: 80% width on desktop, full width on mobile */}
      <div className=" p-[.5rem] md:p-[1rem] flex-1 flex flex-col items-center justify-start h-full ml-0 sm:ml-[30%] lg:ml-[20%] w-full sm:w-[calc(100vw-30%)] lg:w-[calc(100vw-20%)]">
        <div className=" w-full h-full flex flex-col justify-center items-center rounded-2xl shadow-lg flex-1">
          <ToastContainer />
          {currentStep === 0 && <UploadIDComp />}
          {currentStep === 1 && <DataExtractDocComp />}
          {currentStep === 2 && <TakeUserImagesComp />}
          {currentStep === 3 && <FaceSimilarityCheck />}
          {currentStep === 4 && <CreatePasswordComp />}
          {currentStep === 5 && <ReviewDataComp />}
        </div>
      </div>
    </div>
  );
};

export default SignUpFormComponent;
