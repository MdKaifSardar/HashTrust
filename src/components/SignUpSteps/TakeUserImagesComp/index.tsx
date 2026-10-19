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
  setCurrentStep,
  selectCurrentStep,
} from "../../../redux/features/signUpSteps/stepSlice";
import { useLivenessDetector } from "../../../utils/hooks/LivenessDetector";
import { toast } from "react-toastify";
import { resetFaceSimilarityCheck } from "@/redux/features/faceSimilarityCheckSlice/faceSImilarityCheckSlice";
import { FiCamera, FiRefreshCw, FiArrowLeft, FiArrowRight, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export const TakeUserImagesComp: React.FC = () => {
  const dispatch = useDispatch();
  const image = useSelector(selectUserImage);
  const userImagePreview = useSelector(selectUserImagePreview);
  const faceLiveness = useSelector(selectFaceLiveness);
  const faceLivenessScore = useSelector(selectFaceLivenessScore);
  const currentStep = useSelector(selectCurrentStep);

  const [capturing, setCapturing] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [livenessAbortController, setLivenessAbortController] = useState<AbortController | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const {
    loading: livenessLoading,
    error: livenessError,
    checkLiveness,
  } = useLivenessDetector();

  const startCamera = async () => {
    if (cameraOn) return;
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
        "Unable to access camera. Please allow camera permission and retry."
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

  const handleTakePhoto = async () => {
    if (capturing || livenessLoading) return;
    setCapturing(true);

    try {
      const img = captureImage();
      if (!img) {
        toast.error("Failed to capture image.");
        setCapturing(false);
        return;
      }

      if (!image) {
        dispatch(setImage(img));
        dispatch(setUserImagePreview(img));
        dispatch(setLatestUserImagePreview(img));
      } else {
        dispatch(setLatestUserImagePreview(img));
      }

      dispatch(resetFaceSimilarityCheck());
      stopCamera();

      const arr = img.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      const file = new File([u8arr], "user-image.jpg", { type: mime });

      const abortController = new AbortController();
      setLivenessAbortController(abortController);

      const livenessPromise = checkLiveness(file);

      let liveness;
      try {
        liveness = await Promise.race([
          livenessPromise,
          new Promise((_, reject) => {
            abortController.signal.addEventListener("abort", () => reject(new Error("Liveness check cancelled")));
          }),
        ]);
      } catch (e: any) {
        if (e.message === "Liveness check cancelled") {
          dispatch(setFaceLiveness({ isLive: false, score: 0 }));
          toast.info("Liveness check cancelled. Please retake your photo.");
          setLivenessAbortController(null);
          setCapturing(false);
          return;
        } else {
          toast.error("Liveness check failed.");
          setLivenessAbortController(null);
          setCapturing(false);
          return;
        }
      }

      setLivenessAbortController(null);
      const livenessResult = liveness as { isLive: boolean; score: number };
      dispatch(setFaceLiveness(livenessResult));

      if (livenessResult.isLive) {
        toast.success(`Face is LIVE! Realness Score: ${livenessResult.score}/10`);
      } else {
        toast.error("Face is NOT LIVE. Please retake the photo.");
      }
    } catch {
      toast.error("Liveness check failed.");
    } finally {
      setCapturing(false);
    }
  };

  const handleRetake = () => {
    dispatch(resetImages());
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

  useEffect(() => {
    if (!image) startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disableAll = capturing || livenessLoading;

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40">
            <FiCamera size={18} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Biometric Live Capture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Align your face in the camera viewport for passive liveness verification.
            </p>
          </div>
        </div>
      </div>

      {/* Camera / Photo Card */}
      <div className="p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 flex flex-col items-center">
        {/* Viewport Frame */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-sky-500/30 bg-slate-950 shadow-inner flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] ${
              cameraOn && !image ? "block" : "hidden"
            }`}
          />

          {image && userImagePreview && (
            <img
              src={userImagePreview}
              alt="Live Capture Preview"
              className="w-full h-full object-cover"
            />
          )}

          {/* Biometric circular guide mask */}
          {cameraOn && !image && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-2 border-dashed border-sky-400/60 animate-pulse" />
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline" />
            </div>
          )}

          {!cameraOn && !image && (
            <div className="text-center p-4">
              <FiCamera size={36} className="mx-auto text-slate-600 mb-2" />
              <p className="text-xs text-slate-400">Camera preview unavailable</p>
              <button
                type="button"
                onClick={startCamera}
                className="mt-2 text-xs text-sky-400 font-semibold underline"
              >
                Enable Camera
              </button>
            </div>
          )}
        </div>

        {/* Liveness Result Badge */}
        {faceLiveness !== null && (
          <div className="mt-5 flex items-center gap-2">
            <Badge variant={faceLiveness ? "verified" : "danger"} size="md">
              {faceLiveness ? "Face Verified: LIVE" : "Face Not Live: Spoof Suspected"}
            </Badge>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Score: {faceLivenessScore}/10
            </span>
          </div>
        )}

        {/* Camera action buttons */}
        <div className="mt-6 flex items-center gap-3">
          {image ? (
            <Button
              variant="outline"
              size="md"
              onClick={handleRetake}
              disabled={disableAll}
              leftIcon={<FiRefreshCw size={16} />}
            >
              Retake Photo
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleTakePhoto}
              disabled={disableAll || !cameraOn}
              isLoading={disableAll}
              leftIcon={<FiCamera size={18} />}
            >
              {disableAll ? "Analyzing Biometric Liveness..." : "Capture Photo"}
            </Button>
          )}
        </div>

        {livenessError && (
          <div className="mt-3 text-xs text-rose-500 font-medium">
            {livenessError}
          </div>
        )}
      </div>

      {/* Wizard Action Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={disableAll}
          leftIcon={<FiArrowLeft size={16} />}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={disableAll || !image || !faceLiveness}
          rightIcon={<FiArrowRight size={16} />}
        >
          Continue to Similarity Check
        </Button>
      </div>
    </div>
  );
};

export default TakeUserImagesComp;
