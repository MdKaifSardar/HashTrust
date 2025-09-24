"use client";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setImage,
  setUserImagePreview,
  setLatestUserImagePreview, // <-- import this
  setFaceLiveness,
  resetImages,
  selectUserImage,
  selectUserImagePreview,
  selectLatestUserImagePreview, // <-- import this
  selectFaceLiveness,
  selectFaceLivenessScore,
} from "../../../redux/features/userImage/userImageSlice";
import {
  setCurrentStep,
  selectCurrentStep,
} from "../../../redux/features/signUpSteps/stepSlice";
import { useLivenessDetector } from "../../../utils/hooks/LivenessDetector";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetFaceSimilarityCheck } from "@/redux/features/faceSimilarityCheckSlice/faceSImilarityCheckSlice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const TakeUserImagesComp: React.FC = () => {
  const dispatch = useDispatch();
  const image = useSelector(selectUserImage);
  const userImagePreview = useSelector(selectUserImagePreview);
  const latestUserImagePreview = useSelector(selectLatestUserImagePreview);
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

  // Start camera
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

  // Stop camera
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  // Draw current video frame to canvas
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

  // Return a JPEG base64 of the current frame
  const captureImage = (): string | null => {
    const fc = captureFrameToCanvas();
    if (!fc) return null;
    return fc.canvas.toDataURL("image/jpeg", 0.92);
  };

  // Take image and check liveness
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

      // 🔹 First time -> update both states
      if (!image) {
        dispatch(setImage(img));
        dispatch(setUserImagePreview(img));
        dispatch(setLatestUserImagePreview(img));
      } else {
        // 🔹 On retake -> update only latest
        dispatch(setLatestUserImagePreview(img));
      }

      dispatch(resetFaceSimilarityCheck());

      stopCamera(); // Stop camera immediately after photo is taken

      // Convert base64 to File for liveness check
      const arr = img.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      const file = new File([u8arr], "user-image.jpg", { type: mime });

      // Setup abort controller for liveness check
      const abortController = new AbortController();
      setLivenessAbortController(abortController);

      // Await liveness check and only then update UI/state
      const livenessPromise = checkLiveness(file);

      // Wait for liveness check, but allow abort
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
          // Reset liveness state
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
    } catch (e: any) {
      toast.error("Liveness check failed.");
    } finally {
      setCapturing(false);
    }
  };

  // Cancel liveness check
  const handleCancelLivenessCheck = () => {
    if (livenessAbortController) {
      livenessAbortController.abort();
      dispatch(setFaceLiveness({ isLive: false, score: 0 }));
      setLivenessAbortController(null);
      setCapturing(false);
    }
  };

  // Retake image
  const handleRetake = () => {
    dispatch(resetImages());
    startCamera();
  };

  // Prev button
  const handlePrev = () => {
    stopCamera();
    dispatch(setCurrentStep(currentStep - 1));
  };

  // Next button
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
          disabled={disableAll || !image || !faceLiveness}
          className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition
          ${
            disableAll || !image || !faceLiveness
              ? "bg-green-300 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }
        `}
        >
          <FiChevronRight size={28} />
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-blue-700 mt-12">
        Take Your Photo
      </h2>

      <div className="mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`rounded border border-gray-300 ${
            cameraOn && !image ? "" : "hidden"
          }`}
          width={320}
          height={240}
        />
        {!cameraOn && !image && (
          <div className="text-sm text-gray-500 mt-2">Camera is off.</div>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        {userImagePreview && (
          <img
            src={userImagePreview}
            alt="User Preview"
            className="w-32 h-32 object-cover rounded border border-gray-400"
          />
        )}
      </div>

      {livenessError && (
        <div className="text-red-500 mb-2">{livenessError}</div>
      )}

      {faceLiveness !== null && (
        <div className="mb-4">
          <div className="text-lg font-semibold">
            Face is{" "}
            {faceLiveness ? (
              <span className="text-green-600">LIVE</span>
            ) : (
              <span className="text-red-600">NOT LIVE</span>
            )}
          </div>
          <div className="text-sm text-gray-700">
            Realness Score:{" "}
            <span className="font-mono">{faceLivenessScore}/10</span>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={image ? handleRetake : handleTakePhoto}
          disabled={disableAll}
          className={`px-6 py-2 rounded shadow font-semibold ${
            disableAll
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {image ? "Retake" : "Take Image"}
        </button>
        {livenessLoading && livenessAbortController && (
          <button
            type="button"
            onClick={handleCancelLivenessCheck}
            className="px-6 py-2 rounded shadow font-semibold bg-red-600 text-white hover:bg-red-700 border border-red-700 transition"
          >
            Cancel
          </button>
        )}
      </div>
      <div className="p-2 text-center mt-4 text-gray-500 text-sm">
        {capturing
          ? "Working..."
          : livenessLoading
          ? "Checking face liveness..."
          : !image
          ? "Position your face clearly in the frame and click 'Take Image'."
          : "Image captured. You can retake or proceed if face is LIVE."}
      </div>

      <div className="mt-14 w-full flex flex-col items-center">
        {/* Additional content or instructions can go here */}
      </div>
    </div>
  );
};

export default TakeUserImagesComp;
