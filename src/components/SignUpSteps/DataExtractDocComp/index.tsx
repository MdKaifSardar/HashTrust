"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIdentityDocumentFile,
  selectPreviewUrl,
  selectLastUploadedFile,
} from "../../../redux/features/idUpload/idUploadSlice";
import { extractUserDataWithGemini } from "../../../lib/actions/dataExtract.actions";
import {
  setUserData,
  resetUserData,
  selectUserData,
} from "../../../redux/features/userData/userDataSlice";
import {
  setCurrentStep,
  selectCurrentStep,
} from "../../../redux/features/signUpSteps/stepSlice";
import { toast } from "react-toastify";
import { FiArrowLeft, FiArrowRight, FiFileText, FiCheckCircle, FiCpu } from "react-icons/fi";
import Button from "@/components/ui/Button";

export const DataExtractDocComp: React.FC = () => {
  const dispatch = useDispatch();
  const identityDocumentFile = useSelector(selectIdentityDocumentFile);
  const previewUrl = useSelector(selectPreviewUrl);
  const lastUploadedFile = useSelector(selectLastUploadedFile);
  const userData = useSelector(selectUserData);
  const currentStep = useSelector(selectCurrentStep);

  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const autoTriggeredRef = useRef(false);

  const hasExtractedData =
    !!userData?.name &&
    !!userData?.dob &&
    !!userData?.phone &&
    !!userData?.address?.po &&
    !!userData?.address?.district &&
    !!userData?.address?.state &&
    !!userData?.address?.pin;

  useEffect(() => {
    if (identityDocumentFile && identityDocumentFile !== lastUploadedFile) {
      dispatch(resetUserData());
    }
  }, [identityDocumentFile, lastUploadedFile, dispatch]);

  const handleExtract = async () => {
    if (!identityDocumentFile) {
      toast.error("No document uploaded.");
      return;
    }
    setLoading(true);
    setCountdown(null);
    try {
      const data = await extractUserDataWithGemini(identityDocumentFile);
      if (!data || Object.keys(data).length === 0) {
        dispatch(resetUserData());
        toast.error("No data extracted from the document.");
      } else {
        dispatch(setUserData(data));
        toast.success("User data extracted successfully!");
        // Initiate brief review countdown before auto-advancing to Biometrics
        setCountdown(2);
      }
    } catch (err: any) {
      dispatch(resetUserData());
      toast.error(err?.message || "Failed to extract user data");
    } finally {
      setLoading(false);
    }
  };

  // Automatically trigger OCR extraction when landing on this step if not yet extracted
  useEffect(() => {
    if (identityDocumentFile && !hasExtractedData && !loading && !autoTriggeredRef.current) {
      autoTriggeredRef.current = true;
      handleExtract();
    }
  }, [identityDocumentFile, hasExtractedData, loading]);

  // Handle auto-advance countdown
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      dispatch(setCurrentStep(currentStep + 1));
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, currentStep, dispatch]);

  const handleCancelCountdown = () => {
    setCountdown(null);
  };

  const handleNext = () => {
    setCountdown(null);
    if (hasExtractedData) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    setCountdown(null);
    dispatch(setCurrentStep(currentStep - 1));
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40">
            <FiFileText size={18} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Document OCR Extraction
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Our neural OCR parses and validates key attributes from your uploaded ID.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Uploaded Preview & Trigger */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 flex flex-col items-center">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Document Preview"
                className="max-h-52 w-auto object-contain rounded-xl border border-slate-200 dark:border-white/10 shadow-sm"
              />
            )}
            <div className="mt-4 w-full">
              <Button
                variant={hasExtractedData ? "outline" : "primary"}
                fullWidth
                size="md"
                onClick={handleExtract}
                isLoading={loading}
                leftIcon={<FiCpu size={16} />}
              >
                {hasExtractedData ? "Re-run OCR Extraction" : "Extract Document Data"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Extracted Attributes */}
        <div className="flex flex-col">
          {hasExtractedData ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verified Data Fields
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <FiCheckCircle size={14} /> OCR Parsed
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-slate-400">Full Name</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{userData.name}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-slate-400">Date of Birth</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{userData.dob}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-slate-400">Phone Number</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{userData.phone}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-slate-400">ID / Aadhaar No.</span>
                  <span className="font-semibold font-mono text-slate-900 dark:text-slate-100">{userData.idNumber}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Address</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {userData.address.po}, {userData.address.district}, {userData.address.state} - {userData.address.pin}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 p-6 flex flex-col items-center justify-center text-center">
              <FiCpu size={32} className="text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Awaiting Extraction
              </p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Click &ldquo;Extract Document Data&rdquo; to process your document attributes automatically.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Auto-Advance Feedback Banner */}
      {countdown !== null && (
        <div className="mt-6 p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-200 flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-2">
            <FiCheckCircle size={15} className="text-sky-600 dark:text-sky-400 shrink-0" />
            <span>Attributes verified! Auto-advancing to Biometrics in <strong>{countdown}s</strong>...</span>
          </div>
          <button
            type="button"
            onClick={handleCancelCountdown}
            className="text-xs font-semibold text-sky-600 dark:text-sky-300 underline hover:no-underline ml-2 cursor-pointer shrink-0"
          >
            Pause
          </button>
        </div>
      )}

      {/* Action Navigation Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={handleBack}
          leftIcon={<FiArrowLeft size={16} />}
          className="w-full xs:w-auto"
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!hasExtractedData || loading}
          rightIcon={<FiArrowRight size={16} />}
          className="w-full xs:w-auto"
        >
          <span className="inline sm:hidden">Continue</span>
          <span className="hidden sm:inline">Continue to Biometrics</span>
        </Button>
      </div>
    </div>
  );
};

export default DataExtractDocComp;