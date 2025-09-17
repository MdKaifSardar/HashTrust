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
import Loader from "../../Loader";

const UploadIDComp: React.FC = () => {
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
      // Only update preview and clear face image if file changed
      if (
        lastUploadedFile === undefined ||
        (identityDocumentFile && identityDocumentFile !== lastUploadedFile)
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          dispatch(setPreviewUrl(base64)); // <-- now it's data:image/... base64
        };
        reader.readAsDataURL(identityDocumentFile);

        dispatch(setFaceImage(undefined));
        dispatch(setExtractError(null));
        dispatch(setLastUploadedFile(identityDocumentFile));
      }
      // Do NOT clear face image if file is the same (e.g., navigating back or remount)
    } else {
      dispatch(setPreviewUrl(undefined));
      dispatch(setLastUploadedFile(undefined));
      dispatch(setFaceImage(undefined));
      dispatch(setExtractError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identityDocumentFile, dispatch, lastUploadedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (extracting || loading) return;
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type === "image/jpeg" || selected.type === "image/jpg") {
        dispatch(setIdentityDocumentFile(selected));
        // All states (face image, error, etc.) will be reset by useEffect above
      } else {
        dispatch(setPreviewUrl(undefined));
        dispatch(setIdentityDocumentFile(undefined));
        dispatch(setFaceImage(undefined));
        dispatch(setExtractError("Only JPEG image files are allowed."));
      }
    } else {
      dispatch(setPreviewUrl(undefined));
      dispatch(setIdentityDocumentFile(undefined));
      dispatch(setFaceImage(undefined));
      dispatch(setExtractError(null));
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
    }
    dispatch(setExtracting(false));
  };

  const handleNext = () => {
    if (!faceImage) return;
    dispatch(setCurrentStep(currentStep + 1));
  };
  return (
    <div className="flex flex-col items-center">
      <label className="block font-medium mb-2 text-gray-700">
        Upload Identity Document (Aadhaar card, JPEG/JPG)
      </label>
      <div className="flex items-center gap-4 mb-4">
        <label
          className={`flex flex-col items-center px-4 py-6 bg-gray-50 text-blue-500 rounded-lg shadow-lg tracking-wide border border-blue-200 cursor-pointer hover:bg-blue-50 transition ${
            extracting || loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-5 4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <span className="mt-2 text-base leading-normal">Select a file</span>
          <input
            type="file"
            accept="image/jpeg,image/jpg"
            className="hidden"
            onChange={handleFileChange}
            disabled={extracting || loading}
          />
        </label>
        {previewUrl &&
          (identityDocumentFile?.type?.startsWith("image/") ? (
            <img
              src={previewUrl}
              alt="Identity Document Preview"
              className="w-16 h-16 object-cover rounded border border-gray-300"
            />
          ) : (
            <span className="text-gray-700">{previewUrl}</span>
          ))}
      </div>
      {loading && <Loader />}
      {extractError && <div className="text-red-500 mb-2">{extractError}</div>}
      {faceImage && (
        <div className="flex flex-col items-center mt-2">
          <span className="text-gray-700 mb-1">Extracted Face Preview:</span>
          <img
            src={faceImage}
            alt="Extracted Face"
            className="w-24 h-24 object-cover rounded-full border border-gray-300"
          />
        </div>
      )}
      {/* Always display extracted face image if available */}
      <div className="flex gap-3 mb-2">
        <button
          type="button"
          onClick={handleExtractFace}
          disabled={extracting || loading || !identityDocumentFile}
          className={`px-6 py-2 rounded shadow transition font-semibold ${
            extracting || loading || !identityDocumentFile
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Extract
        </button>
        {faceImage && identityDocumentFile === lastUploadedFile && (
          <button
            type="button"
            onClick={handleExtractFace}
            disabled={extracting || loading || !identityDocumentFile}
            className={`px-6 py-2 rounded shadow transition font-semibold ${
              extracting || loading || !identityDocumentFile
                ? "bg-yellow-300 text-white cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            Re-extract
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!faceImage}
          className={`px-6 py-2 rounded shadow transition font-semibold ${
            !faceImage
              ? "bg-green-300 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default UploadIDComp;
