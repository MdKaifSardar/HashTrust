"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { compareFacesAction } from "@/lib/actions/faceSimilarity.actions";

type ApiSuccess = {
  confidence: number;
  ok: boolean;
  message: string;
};

export default function FaceSimilarityPage() {
  const [mainPhoto, setMainPhoto] = useState<File | null>(null);
  const [testPhoto, setTestPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiSuccess | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!mainPhoto || !testPhoto) {
      toast.error("Please select a main photo and a test photo!");
      return;
    }

    const formData = new FormData();
    formData.append("image1", mainPhoto);
    formData.append("image2", testPhoto);

    try {
      setLoading(true);
      setResult(null);

      const data = await compareFacesAction(formData);

      if (!data.ok) {
        toast.error(data.message || "Failed to check similarity");
        setResult(null);
        return;
      }

      if (typeof data.confidence === "number") {
        setResult({
          ok: data.ok,
          message: data.message,
          confidence: data.confidence,
        });

        toast.success(
          `Done! Confidence: ${data.confidence} — ${
            data.confidence > 80 ? "Likely same person" : "Different person"
          }`
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Face Similarity Check (Face++)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Photo */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Main Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMainPhoto(e.target.files?.[0] ?? null)
              }
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Test Photo */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Test Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTestPhoto(e.target.files?.[0] ?? null)
              }
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Checking..." : "Check Similarity"}
          </button>
        </form>

        {/* Result Panel */}
        {result && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-semibold">Result</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  result.confidence > 80
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {result.confidence > 80 ? "Likely Same Person" : "Different Person"}
              </span>
            </div>
            <div className="mt-2 text-gray-700">
              <span className="font-semibold">Confidence:</span>{" "}
              {result.confidence}
            </div>
            <div className="mt-2 text-gray-500 text-xs">
              {result.message}
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}