"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFaceSimilarityCheck,
  selectFaceSimilarityCheck,
  setIdFaceImage,
  setUserFaceImage,
  setSimilarityResult,
  setLoading,
  setError,
  setApiResult,
  setHasChecked,
} from "../../../redux/features/faceSimilarityCheckSlice/faceSImilarityCheckSlice";
import { selectFaceImage } from "../../../redux/features/idUpload/idUploadSlice";
import {
  selectUserImagePreview,
  selectLatestUserImagePreview,
} from "../../../redux/features/userImage/userImageSlice";
import {
  setCurrentStep,
  selectCurrentStep,
} from "../../../redux/features/signUpSteps/stepSlice";
import { compareFacesAction } from "../../../lib/actions/faceSimilarity.actions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCheckSquare, FiArrowLeft, FiArrowRight, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

async function urlOrBase64ToFile(src: string, filename: string): Promise<File> {
  if (src.startsWith("data:")) {
    const arr = src.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; ++i) u8arr[i] = bstr.charCodeAt(i);
    return new File([u8arr], filename, { type: mime });
  } else {
    const res = await fetch(src);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
  }
}

export const FaceSimilarityCheck: React.FC = () => {
  const dispatch = useDispatch();
  const { similarityScore, isMatch, loading, error, hasChecked } =
    useSelector(selectFaceSimilarityCheck);
  const extractedFacePreview = useSelector(selectFaceImage);
  const userImagePreview = useSelector(selectUserImagePreview);
  const latestUserImagePreview = useSelector(selectLatestUserImagePreview);
  const currentStep = useSelector(selectCurrentStep);

  const prevLatestUserImagePreview = useRef<string | null | undefined>(
    latestUserImagePreview
  );

  useEffect(() => {
    dispatch(setIdFaceImage(extractedFacePreview ?? null));
    dispatch(setUserFaceImage(userImagePreview ?? null));
    if (
      prevLatestUserImagePreview.current !== undefined &&
      latestUserImagePreview &&
      prevLatestUserImagePreview.current !== latestUserImagePreview
    ) {
      dispatch(resetFaceSimilarityCheck());
    }
    prevLatestUserImagePreview.current = latestUserImagePreview;
  }, [
    extractedFacePreview,
    userImagePreview,
    latestUserImagePreview,
    dispatch,
  ]);

  const handleCheckSimilarity = async () => {
    if (!extractedFacePreview || !userImagePreview) {
      toast.error("Both face images are required.");
      return;
    }
    dispatch(setApiResult(null));
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const mainFile = await urlOrBase64ToFile(
        extractedFacePreview,
        "main_photo.jpg"
      );
      const testFile = await urlOrBase64ToFile(
        userImagePreview,
        "test_photo.jpg"
      );
      const formData = new FormData();
      formData.append("image1", mainFile);
      formData.append("image2", testFile);

      const apiRes = await compareFacesAction(formData);

      dispatch(setApiResult(apiRes));
      const confidence = apiRes.confidence ?? 0;
      const match = apiRes.isMatch ?? false;

      if (apiRes.ok) {
        dispatch(
          setSimilarityResult({
            score: confidence,
            isMatch: match,
          })
        );
        dispatch(setHasChecked(true));
        toast.success(
          `Comparison complete! Score: ${confidence}% — ${
            match ? "Identity Matched" : "Match Failed"
          }`
        );
      } else {
        dispatch(setError(apiRes.message || "Face similarity check failed."));
        dispatch(setHasChecked(false));
        toast.error(apiRes.message || "Face similarity check failed.");
      }
    } catch (err: any) {
      dispatch(setError(err?.message || "Face similarity check failed."));
      dispatch(setHasChecked(false));
      toast.error(err?.message || "Face similarity check failed.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleNext = () => dispatch(setCurrentStep(currentStep + 1));
  const handlePrev = () => dispatch(setCurrentStep(currentStep - 1));

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40">
            <FiCheckSquare size={18} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              1:1 Biometric Match
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Cross-verifying your live selfie against your government ID photograph.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Viewport */}
      <div className="p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 flex flex-col items-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 w-full">
          {/* Card 1: ID Face */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Gov ID Document
            </span>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-white/10 shadow-sm bg-slate-100 dark:bg-slate-800">
              {extractedFacePreview ? (
                <img
                  src={extractedFacePreview}
                  alt="Extracted Face"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  Missing
                </div>
              )}
            </div>
          </div>

          {/* Connection Indicator */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-800 font-bold text-xs">
              VS
            </div>
          </div>

          {/* Card 2: Live Selfie */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Live Webcam Capture
            </span>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-white/10 shadow-sm bg-slate-100 dark:bg-slate-800">
              {userImagePreview ? (
                <img
                  src={userImagePreview}
                  alt="Live Selfie"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  Missing
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Match Result Display */}
        {similarityScore !== null && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <Badge variant={isMatch ? "verified" : "danger"} size="md">
              {isMatch ? "Biometrics Matched" : "Match Failed: Significant Discrepancy"}
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Similarity Confidence: <strong className="text-slate-900 dark:text-white font-bold">{similarityScore}%</strong>
            </span>
          </div>
        )}

        {/* Trigger Button */}
        <div className="mt-6">
          <Button
            variant="primary"
            size="md"
            onClick={handleCheckSimilarity}
            disabled={loading || !extractedFacePreview || !userImagePreview}
            isLoading={loading}
          >
            {hasChecked ? "Re-run Biometric Comparison" : "Compare Biometric Signatures"}
          </Button>
        </div>

        {error && (
          <div className="mt-3 text-xs text-rose-500 font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={loading}
          leftIcon={<FiArrowLeft size={16} />}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={loading || !isMatch}
          rightIcon={<FiArrowRight size={16} />}
        >
          Continue to Credentials
        </Button>
      </div>
    </div>
  );
};

export default FaceSimilarityCheck;
