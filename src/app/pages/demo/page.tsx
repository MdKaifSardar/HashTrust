"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ApiSuccess = {
  similarity: number;
  same_person: boolean;
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
    formData.append("main_photo", mainPhoto);
    formData.append("test_photo", testPhoto);

    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("http://localhost:8080/api/v1/face/check-human", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        // HTTP error
        throw new Error(data?.detail || "Failed to check similarity");
      }

      if (data?.error) {
        // API returned an error payload
        toast.error(data.error);
        setResult(null);
        return;
      }

      // Expecting { similarity: number, same_person: boolean }
      const parsed: ApiSuccess = {
        similarity: Number(data.similarity),
        same_person: Boolean(data.same_person),
      };
      setResult(parsed);

      toast.success(
        `Done! Similarity: ${parsed.similarity.toFixed(3)} — ${
          parsed.same_person ? "Same person" : "Different person"
        }`
      );
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
          Face Similarity Check
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
              <span className="text-gray-700 font-semibold">Same person?</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  result.same_person
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {result.same_person ? "Yes" : "No"}
              </span>
            </div>
            <div className="mt-2 text-gray-700">
              <span className="font-semibold">Similarity:</span>{" "}
              {result.similarity.toFixed(3)}
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}
