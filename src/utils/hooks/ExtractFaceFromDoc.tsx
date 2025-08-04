import { useState } from "react";

export interface ExtractFaceResult {
  faceUrl?: string;
  error?: string;
  message?: string;
}

export function useExtractFaceFromDoc() {
  const [loading, setLoading] = useState(false);

  const extractFace = async (file: File): Promise<ExtractFaceResult> => {
    setLoading(true);
    const FACE_API_URL =
      "https://face-extraction-from-doc.onrender.com/api/v1/face/detect-face";
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(FACE_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setLoading(false);
        return {
          error: err?.message || err?.error || "Face extraction failed!",
        };
      }

      const apiMessage = res.headers.get("x-message");
      const blob = await res.blob();
      setLoading(false);
      return {
        faceUrl: URL.createObjectURL(blob),
        message: apiMessage || "Face extracted successfully!",
      };
    } catch (error: any) {
      setLoading(false);
      return {
        error: error?.message || "An error occurred while extracting the face.",
      };
    }
  };

  return { extractFace, loading };
}
