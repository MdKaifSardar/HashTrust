"use client";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImages, resetImages, selectUserImages } from "../../../redux/features/userImage/userImageSlice";
import { setCurrentStep, selectCurrentStep } from "../../../redux/features/signUpSteps/stepSlice";

const TakeUserImagesComp: React.FC = () => {
  const dispatch = useDispatch();
  const images = useSelector(selectUserImages);
  const currentStep = useSelector(selectCurrentStep);

  const [capturing, setCapturing] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = async () => {
    if (cameraOn) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setCameraOn(true);
    } catch {
      alert("Unable to access camera.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCameraOn(false);
  };

  // Capture a single image from the video stream
  const captureImage = (): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg");
  };

  // Take 3 images, 2s apart
  const takeThreeImages = async () => {
    setCapturing(true);
    dispatch(resetImages());
    const newImages: string[] = [];
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, i === 0 ? 500 : 2000));
      const img = captureImage();
      if (img) newImages.push(img);
      dispatch(setImages([...newImages]));
    }
    setCapturing(false);
  };

  // Retake images
  const handleRetake = () => {
    dispatch(resetImages());
    takeThreeImages();
  };

  // Proceed to next step
  const handleNext = () => {
    if (images.length === 3) {
      stopCamera();
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  // Go back to previous step
  const handleBack = () => {
    stopCamera();
    dispatch(setCurrentStep(currentStep - 1));
  };

  // Start camera on mount if not already on
  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Automatically take images if camera is on and not capturing and no images yet
  React.useEffect(() => {
    if (cameraOn && !capturing && images.length === 0) {
      takeThreeImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraOn]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Take Your Photos</h2>
      <div className="mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`rounded border border-gray-300 ${cameraOn ? "" : "hidden"}`}
          width={320}
          height={240}
        />
      </div>
      <div className="flex gap-4 mb-4">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`User ${idx + 1}`}
            className="w-24 h-24 object-cover rounded border border-gray-400"
          />
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-2 rounded shadow font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleRetake}
          disabled={capturing}
          className={`px-6 py-2 rounded shadow font-semibold ${
            capturing
              ? "bg-yellow-300 text-white cursor-not-allowed"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          }`}
        >
          Retake
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={images.length !== 3 || capturing}
          className={`px-6 py-2 rounded shadow font-semibold ${
            images.length !== 3 || capturing
              ? "bg-green-300 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>
      <div className="mt-4 text-gray-500 text-sm">
        {capturing
          ? "Capturing images..."
          : images.length === 3
          ? "All images captured. You can proceed or retake."
          : "Images will be captured automatically."}
      </div>
    </div>
  );
};

export default TakeUserImagesComp;
