"use client";

import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setImage,
  setUserImagePreview,
  setLatestUserImagePreview,
  setFaceLiveness,
  resetImages,
  selectUserImage,
  selectUserImagePreview,
  selectFaceLiveness,
  selectFaceLivenessScore,
} from "../../../redux/features/userImage/userImageSlice";
import {
  resetFaceSimilarityCheck,
  selectFaceSimilarityCheck,
  setIdFaceImage,
  setUserFaceImage,
  setSimilarityResult,
  setLoading as setSimilarityLoading,
  setError as setSimilarityError,
  setHasChecked,
} from "../../../redux/features/faceSimilarityCheckSlice/faceSImilarityCheckSlice";
import { selectFaceImage } from "../../../redux/features/idUpload/idUploadSlice";
import {
  setCurrentStep,
  selectCurrentStep,
} from "../../../redux/features/signUpSteps/stepSlice";
import { useLivenessDetector } from "../../../utils/hooks/LivenessDetector";
import { compareFacesAction } from "../../../lib/actions/faceSimilarity.actions";
import { toast } from "react-toastify";
import {
  FiCamera,
  FiRefreshCw,
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiAlertTriangle,
  FiUserCheck,
} from "react-icons/fi";
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

export const BiometricVerificationComp: React.FC = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);

  // Redux state
  const extractedFacePreview = useSelector(selectFaceImage);
  const userImagePreview = useSelector(selectUserImagePreview);
  const faceLiveness = useSelector(selectFaceLiveness);
  const faceLivenessScore = useSelector(selectFaceLivenessScore);
  const { similarityScore, isMatch, hasChecked } = useSelector(
    selectFaceSimilarityCheck
  );

  // Local state
  const [cameraOn, setCameraOn] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [verificationStage, setVerificationStage] = useState<
    "idle" | "liveness" | "similarity" | "done"
  >("idle");
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const {
    loading: livenessLoading,
    checkLiveness,
  } = useLivenessDetector();

  // Keep FaceSimilarity slice in sync with ID crop
  useEffect(() => {
    dispatch(setIdFaceImage(extractedFacePreview ?? null));
  }, [extractedFacePreview, dispatch]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    if (cameraOn) return;
    setVerificationError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setCameraOn(true);
    } catch {
      toast.error(
        "Unable to access camera. Please allow camera permissions in your browser and try again."
      );
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const captureFrameToCanvas = () => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return { canvas, width: canvas.width, height: canvas.height };
  };

  const captureImage = (): string | null => {
    const fc = captureFrameToCanvas();
    if (!fc) return null;
    return fc.canvas.toDataURL("image/jpeg", 0.92);
  };

  // The Consolidated Verification Pipeline
  const handleCaptureAndVerify = async () => {
    if (capturing || livenessLoading) return;
    if (!extractedFacePreview) {
      toast.error("ID document face photo is missing. Please go back to step 1.");
      return;
    }

    setCapturing(true);
    setVerificationError(null);

    try {
      const img = captureImage();
      if (!img) {
        toast.error("Failed to capture photo frame.");
        setCapturing(false);
        return;
      }

      // Save preview in Redux
      dispatch(setImage(img));
      dispatch(setUserImagePreview(img));
      dispatch(setLatestUserImagePreview(img));
      dispatch(setUserFaceImage(img));

      // Stop camera once snapped
      stopCamera();

      // Convert captured base64 to File
      const selfieFile = await urlOrBase64ToFile(img, "selfie.jpg");

      // Phase 1: Passive Liveness Detection
      setVerificationStage("liveness");
      const livenessResult = await checkLiveness(selfieFile);
      dispatch(setFaceLiveness(livenessResult));

      if (!livenessResult.isLive) {
        setVerificationStage("done");
        setVerificationError(
          `Passive liveness scan failed (${livenessResult.score}/10). Anti-spoofing engine detected a screen, printout, or non-live face.`
        );
        toast.error("Liveness check failed. Please retake a live selfie.");
        setCapturing(false);
        return;
      }

      toast.success(`Face is LIVE! Realness score: ${livenessResult.score}/10`);

      // Phase 2: 1:1 ID Face Similarity Comparison
      setVerificationStage("similarity");
      dispatch(setSimilarityLoading(true));

      const idFaceFile = await urlOrBase64ToFile(
        extractedFacePreview,
        "id_face.jpg"
      );

      const formData = new FormData();
      formData.append("image1", idFaceFile);
      formData.append("image2", selfieFile);

      const apiRes = await compareFacesAction(formData);

      if (apiRes.ok) {
        dispatch(setHasChecked(true));
        dispatch(
          setSimilarityResult({
            score: apiRes.confidence,
            isMatch: apiRes.confidence >= 80,
          })
        );

        if (apiRes.confidence >= 80) {
          toast.success(
            `Face Matched! Identity verified with ${apiRes.confidence}% similarity.`
          );
        } else {
          setVerificationError(
            `Face does not match the ID photo (Similarity: ${apiRes.confidence}%). Minimum required is 80%.`
          );
          toast.error("Face similarity check did not meet the match threshold.");
        }
      } else {
        dispatch(setSimilarityError(apiRes.message));
        setVerificationError(apiRes.message || "Failed to compare faces.");
        toast.error(apiRes.message || "Face comparison error.");
      }

      setVerificationStage("done");
    } catch (err: any) {
      setVerificationStage("done");
      setVerificationError(err?.message || "Verification failed unexpectedly.");
      toast.error("Biometric verification failed.");
    } finally {
      setCapturing(false);
      dispatch(setSimilarityLoading(false));
    }
  };

  const handleRetake = () => {
    dispatch(resetImages());
    dispatch(resetFaceSimilarityCheck());
    setVerificationStage("idle");
    setVerificationError(null);
    startCamera();
  };

  const handlePrev = () => {
    stopCamera();
    dispatch(setCurrentStep(currentStep - 1));
  };

  const handleNext = () => {
    stopCamera();
    dispatch(setCurrentStep(currentStep + 1));
  };

  const isBothVerified =
    faceLiveness === true && isMatch === true && (similarityScore ?? 0) >= 80;

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40">
            <FiUserCheck size={18} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Biometric Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Prove live personhood and verify facial match against your government ID.
            </p>
          </div>
        </div>
      </div>

      {/* Warning if ID face is missing */}
      {!extractedFacePreview && (
        <div className="p-4 mb-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
          <FiAlertTriangle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
          <div className="flex-1 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
            <p className="font-bold mb-1">ID Card Photo Missing</p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              We could not extract a clear headshot from your uploaded ID card.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs"
              onClick={() => dispatch(setCurrentStep(0))}
            >
              Back to ID Upload
            </Button>
          </div>
        </div>
      )}

      {/* Main Workspace Grid: ID Crop vs Webcam/Selfie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left: ID Document Face Target */}
        <div className="p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 flex flex-col items-center justify-between text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Reference Target
          </span>
          <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-white/10 shadow-sm relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {extractedFacePreview ? (
              <img
                src={extractedFacePreview}
                alt="ID Document Crop"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-400">No ID Face</span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Government ID Photo
            </p>
            <p className="text-[11px] text-slate-400">
              Extracted automatically from your document
            </p>
          </div>
        </div>

        {/* Right: Live Camera or Captured Selfie */}
        <div className="p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Live Biometric Capture
          </span>

          {/* Camera Frame / Preview */}
          <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-sky-400 dark:border-sky-500 shadow-md relative bg-slate-900 flex items-center justify-center">
            {userImagePreview ? (
              <img
                src={userImagePreview}
                alt="Captured Live Selfie"
                className="w-full h-full object-cover"
              />
            ) : cameraOn ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: "scaleX(-1)" }}
                />
                {/* Oval Guide Overlay */}
                <div className="absolute inset-2 border-2 border-white/60 border-dashed rounded-full pointer-events-none animate-pulse" />
              </>
            ) : (
              <div className="flex flex-col items-center gap-1.5 p-2 text-slate-400">
                <FiCamera size={26} />
                <span className="text-[10px]">Camera Off</span>
              </div>
            )}
          </div>

          {/* Camera Control Action */}
          <div className="mt-4 w-full">
            {!userImagePreview ? (
              !cameraOn ? (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={startCamera}
                  leftIcon={<FiCamera size={14} />}
                >
                  Turn On Camera
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  className="w-full text-xs shadow-sm shadow-emerald-500/20"
                  onClick={handleCaptureAndVerify}
                  disabled={capturing || livenessLoading}
                  leftIcon={<FiCheckCircle size={14} />}
                >
                  {capturing
                    ? "Capturing..."
                    : "Capture & Verify Face"}
                </Button>
              )
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={handleRetake}
                leftIcon={<FiRefreshCw size={14} />}
              >
                Retake Photo
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Pipeline Progress Indicator */}
      {capturing && (
        <div className="p-4 mb-6 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/50 flex items-center gap-3 animate-pulse">
          <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin shrink-0" />
          <div className="text-xs sm:text-sm text-sky-900 dark:text-sky-200">
            {verificationStage === "liveness" && (
              <span><strong>Step 1/2:</strong> Checking passive liveness & anti-spoofing...</span>
            )}
            {verificationStage === "similarity" && (
              <span><strong>Step 2/2:</strong> Matching live facial geometry with ID document...</span>
            )}
          </div>
        </div>
      )}

      {/* Verification Status Badges (When completed) */}
      {userImagePreview && !capturing && (
        <div className="p-5 mb-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Anti-Spoofing Liveness
            </span>
            <Badge
              variant={faceLiveness ? "verified" : "danger"}
              size="sm"
            >
              {faceLiveness
                ? `LIVE (${faceLivenessScore}/10)`
                : "SPOOF DETECTED"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              1:1 Face Similarity Match
            </span>
            <Badge
              variant={isMatch ? "verified" : "danger"}
              size="sm"
            >
              {hasChecked
                ? isMatch
                  ? `MATCHED (${similarityScore}%)`
                  : `FAILED (${similarityScore}%)`
                : "PENDING"}
            </Badge>
          </div>
        </div>
      )}

      {/* Error Callout if any test failed */}
      {verificationError && (
        <div className="p-4 mb-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
          <FiXCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold mb-0.5">Verification Incomplete</p>
            <p>{verificationError}</p>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          leftIcon={<FiArrowLeft size={16} />}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!isBothVerified}
          rightIcon={<FiArrowRight size={16} />}
        >
          Continue to Credentials
        </Button>
      </div>
    </div>
  );
};

export default BiometricVerificationComp;
