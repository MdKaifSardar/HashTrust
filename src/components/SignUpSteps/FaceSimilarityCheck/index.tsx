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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Helper to convert base64 data URL or blob/http URL to File
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

const FaceSimilarityCheck: React.FC = () => {
  const dispatch = useDispatch();
  const { similarityScore, isMatch, loading, error, apiResult, hasChecked } =
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
    // Reset similarity check data if a new user image is taken
    if (
      prevLatestUserImagePreview.current !== undefined &&
      latestUserImagePreview &&
      prevLatestUserImagePreview.current !== latestUserImagePreview
    ) {
      dispatch(resetFaceSimilarityCheck());
    }
    prevLatestUserImagePreview.current = latestUserImagePreview;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    extractedFacePreview,
    userImagePreview,
    latestUserImagePreview,
    dispatch,
  ]);

  // On mount, if similarityScore is present, set hasChecked to true and restore apiResult for display

  const handleCheckSimilarity = async () => {
    if (!extractedFacePreview || !userImagePreview) {
      toast.error("Both face images are required.");
      return;
    }
    dispatch(setApiResult(null));
    dispatch(setLoading(true));
    dispatch(setError(null));
    toast.info("Checking face similarity...");
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

      // Use 75 as threshold for match
      const confidence = apiRes.confidence ?? 0;
      const isMatch = confidence >= 75;

      if (apiRes.ok) {
        dispatch(
          setSimilarityResult({
            score: confidence,
            isMatch: isMatch,
          })
        );
        dispatch(setHasChecked(true));
        toast.success(
          `Done! Confidence: ${confidence} — ${
            isMatch ? "Matched" : "Not Matched"
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

  const disableAll = loading;

  return (
    <div className="bg-transparent flex flex-col justify-center items-center h-full rounded-lg relative w-full min-h-screen">
      {/* Top navigation buttons at top corners */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-2 py-2 z-10">
        <button
          type="button"
          onClick={handlePrev}
          disabled={disableAll}
          className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition
          ${
            disableAll
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-blue-700 hover:bg-gray-300"
          }
        `}
        >
          <FiChevronLeft size={28} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={disableAll || !isMatch}
          className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition
          ${
            disableAll || !isMatch
              ? "bg-green-300 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }
        `}
        >
          <FiChevronRight size={28} />
        </button>
      </div>

      <div className="w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          Face Similarity Check
        </h2>
        <div className="flex gap-8 mb-6 items-center">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 mb-2">Extracted Face</span>
            {extractedFacePreview ? (
              <img
                src={extractedFacePreview}
                alt="Extracted Face"
                className="w-32 h-32 object-cover rounded border"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded border flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 mb-2">Taken Image</span>
            {userImagePreview ? (
              <img
                src={userImagePreview}
                alt="User Face"
                className="w-32 h-32 object-cover rounded border"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded border flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>

        <div className="mt-[.5rem] text-gray-700 text-sm w-full flex flex-col items-center">
          {loading ? (
            "Checking similarity..."
          ) : similarityScore !== null ? (
            <div className="flex flex-col items-center gap-2">
              <span>
                Confidence Score:{" "}
                <span className="font-mono text-blue-700 font-bold">
                  {similarityScore}
                </span>
              </span>
              <span
                className={`font-semibold text-lg ${
                  isMatch ? "text-green-600" : "text-red-600"
                }`}
              >
                {isMatch ? "Matched" : "Not Matched"}
              </span>
            </div>
          ) : null}
        </div>

        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default FaceSimilarityCheck;
