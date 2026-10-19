"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIdentityDocumentFile,
  setFaceImage,
  setExtracting,
  setExtractError,
  selectIdentityDocumentFile,
  selectFaceImage,
  selectExtracting,
  selectExtractError,
  setPreviewUrl,
  selectPreviewUrl,
  setLastUploadedFile,
  selectLastUploadedFile,
} from "../../../redux/features/idUpload/idUploadSlice";
import {
  setCurrentStep,
  selectCurrentStep,
} from "../../../redux/features/signUpSteps/stepSlice";
import { toast } from "react-toastify";
import { useExtractFaceFromDoc } from "../../../utils/hooks/ExtractFaceFromDoc";
import { FiArrowRight, FiFileText, FiCheckCircle } from "react-icons/fi";
import { resetUserData } from "../../../redux/features/userData/userDataSlice";
import { resetFaceSimilarityCheck } from "../../../redux/features/faceSimilarityCheckSlice/faceSImilarityCheckSlice";
import Button from "@/components/ui/Button";
import Dropzone from "@/components/ui/Dropzone";

export const UploadIDComp: React.FC = () => {
  const dispatch = useDispatch();
  const identityDocumentFile = useSelector(selectIdentityDocumentFile);
  const faceImage = useSelector(selectFaceImage);
  const extracting = useSelector(selectExtracting);
  const extractError = useSelector(selectExtractError);
  const currentStep = useSelector(selectCurrentStep);
  const previewUrl = useSelector(selectPreviewUrl);
  const lastUploadedFile = useSelector(selectLastUploadedFile);

  const { extractFace, loading } = useExtractFaceFromDoc();

  useEffect(() => {
    if (identityDocumentFile) {
      if (
        lastUploadedFile === undefined ||
        (identityDocumentFile && identityDocumentFile !== lastUploadedFile)
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          dispatch(setPreviewUrl(base64));
        };
        reader.readAsDataURL(identityDocumentFile);

        dispatch(setFaceImage(undefined));
        dispatch(setExtractError(null));
        dispatch(setLastUploadedFile(identityDocumentFile));
      }
    } else {
      dispatch(setPreviewUrl(undefined));
      dispatch(setLastUploadedFile(undefined));
      dispatch(setFaceImage(undefined));
      dispatch(setExtractError(null));
    }
  }, [identityDocumentFile, dispatch, lastUploadedFile]);

  const handleFileSelect = (file: File | null) => {
    if (extracting || loading) return;
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/jpg") {
        dispatch(setIdentityDocumentFile(file));
        dispatch(resetUserData());
      } else {
        dispatch(setPreviewUrl(undefined));
        dispatch(setIdentityDocumentFile(undefined));
        dispatch(setFaceImage(undefined));
        dispatch(setExtractError("Only JPEG/JPG image files are allowed."));
        dispatch(resetUserData());
        toast.error("Only JPEG/JPG image files are allowed.");
      }
    } else {
      dispatch(setPreviewUrl(undefined));
      dispatch(setIdentityDocumentFile(undefined));
      dispatch(setFaceImage(undefined));
      dispatch(setExtractError(null));
      dispatch(resetUserData());
    }
  };

  const handleExtractFace = async () => {
    if (!identityDocumentFile) {
      toast.error("Please upload your identity document first.");
      return;
    }
    dispatch(setExtracting(true));
    dispatch(setExtractError(null));
    dispatch(setFaceImage(undefined));

    const result = await extractFace(identityDocumentFile);

    if (result.error) {
      dispatch(setExtractError(result.error));
      toast.error(result.error);
      dispatch(setExtracting(false));
      return;
    }
    if (result.message) toast.success(result.message);
    if (result.faceUrl) {
      dispatch(setFaceImage(result.faceUrl));
      dispatch(resetFaceSimilarityCheck());
    }
    dispatch(setExtracting(false));
  };

  const handleNext = () => {
    if (!faceImage) return;
    dispatch(setCurrentStep(currentStep + 1));
  };

  return (
    <div className="w-full flex flex-col">
      {/* Step Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40">
            <FiFileText size={18} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Upload Identity Document
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Upload your official Aadhaar card (JPEG/JPG format) for biometric verification.
            </p>
          </div>
        </div>
      </div>

      {/* Main Upload Dropzone */}
      <div className="space-y-6">
        <Dropzone
          onFileSelect={handleFileSelect}
          selectedFile={identityDocumentFile}
          previewUrl={previewUrl}
          accept="image/jpeg,image/jpg"
          label="Drop your Aadhaar Card here, or browse"
          description="High-resolution JPEG or JPG image"
        />

        {extractError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium text-center">
            {extractError}
          </div>
        )}

        {/* Biometric Face Crop Preview */}
        {faceImage && (
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={faceImage}
                alt="Extracted Biometric Face"
                className="w-14 h-14 object-cover rounded-xl border-2 border-emerald-500 shadow-sm"
              />
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <FiCheckCircle size={14} /> Biometric Face Extracted
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ready for liveness and similarity comparison
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExtractFace}
              isLoading={extracting || loading}
            >
              Re-extract
            </Button>
          </div>
        )}

        {/* Extract Button if not yet extracted */}
        {!faceImage && identityDocumentFile && (
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleExtractFace}
            isLoading={extracting || loading}
          >
            Extract Biometric Photo from Document
          </Button>
        )}
      </div>

      {/* Wizard Action Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-end">
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!faceImage}
          rightIcon={<FiArrowRight size={16} />}
        >
          Continue to OCR Extraction
        </Button>
      </div>
    </div>
  );
};

export default UploadIDComp;