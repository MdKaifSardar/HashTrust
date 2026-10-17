"use client";

import { useState } from "react";
import { extractFaceCoordinatesAction } from "@/lib/actions/faceExtract.actions";

export interface ExtractFaceResult {
  faceUrl?: string;
  error?: string;
  message?: string;
}

/**
 * Loads an image File into an HTMLImageElement
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to decode uploaded image."));
    };
    img.src = objectUrl;
  });
}

/**
 * Crops a bounding box from an HTMLImageElement with safety padding and boundary clamping
 */
function cropFaceFromImage(
  img: HTMLImageElement,
  box: { top: number; left: number; width: number; height: number; isNormalized?: boolean }
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to initialize 2D canvas rendering context.");
  }

  const naturalWidth = img.naturalWidth || img.width;
  const naturalHeight = img.naturalHeight || img.height;

  // Convert normalized (0-1000) coordinates to actual pixels if needed
  let rawLeft = box.isNormalized ? (box.left / 1000) * naturalWidth : box.left;
  let rawTop = box.isNormalized ? (box.top / 1000) * naturalHeight : box.top;
  let rawWidth = box.isNormalized ? (box.width / 1000) * naturalWidth : box.width;
  let rawHeight = box.isNormalized ? (box.height / 1000) * naturalHeight : box.height;

  // Ergonomic padding: +18% top (hair/forehead), +12% sides & bottom (chin/ears)
  const padX = rawWidth * 0.12;
  const padYTop = rawHeight * 0.18;
  const padYBottom = rawHeight * 0.12;

  const cropX = Math.max(0, Math.round(rawLeft - padX));
  const cropY = Math.max(0, Math.round(rawTop - padYTop));
  const cropW = Math.min(naturalWidth - cropX, Math.round(rawWidth + padX * 2));
  const cropH = Math.min(naturalHeight - cropY, Math.round(rawHeight + padYTop + padYBottom));

  if (cropW <= 0 || cropH <= 0) {
    throw new Error("Detected face boundaries are outside valid image dimensions.");
  }

  canvas.width = cropW;
  canvas.height = cropH;

  // Draw the sub-rectangle directly from the image
  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

  return canvas.toDataURL("image/jpeg", 0.95);
}

export function useExtractFaceFromDoc() {
  const [loading, setLoading] = useState(false);

  const extractFace = async (file: File): Promise<ExtractFaceResult> => {
    setLoading(true);
    const startTime = performance.now();

    try {
      if (!file) {
        setLoading(false);
        return {
          error: "No identity document file provided.",
        };
      }

      // 1. Detect face coordinates via Next.js Server Action (Face++ with Gemini fallback)
      const formData = new FormData();
      formData.append("file", file);

      const actionResult = await extractFaceCoordinatesAction(formData);

      if (!actionResult.ok || !actionResult.box) {
        setLoading(false);
        return {
          error: actionResult.error || "Could not detect a face in the document.",
        };
      }

      // 2. Decode the image in the browser and crop accurately on an offscreen canvas
      const img = await loadImageFromFile(file);
      const faceDataUrl = cropFaceFromImage(img, actionResult.box);

      const elapsed = Math.round(performance.now() - startTime);
      const engineName = actionResult.engine === "gemini" ? "Gemini 2.5 Flash" : "Face++ Engine";

      setLoading(false);
      return {
        faceUrl: faceDataUrl,
        message: `Face extracted successfully in ${elapsed}ms (${engineName})!`,
      };
    } catch (error: any) {
      setLoading(false);
      return {
        error: error?.message || "An unexpected error occurred while extracting the face.",
      };
    }
  };

  return { extractFace, loading };
}
