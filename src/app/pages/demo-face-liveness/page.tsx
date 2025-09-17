// pages/liveness.tsx
"use client";
import { useLivenessDetector } from "@/utils/hooks/LivenessDetector";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LivenessPage() {
  const { loading, result, error, checkLiveness } = useLivenessDetector(); // <-- use new hook
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    // revoke object URLs on unmount
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    try {
      toast.info("Checking liveness...");
      await checkLiveness(file); // <-- use hook for submission
      toast.success("Liveness check completed");
    } catch (err: any) {
      toast.error(`Liveness check failed: ${err?.message ?? err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <ToastContainer position="top-right" />
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Silent Face Liveness</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="block w-full">
              <span className="text-sm font-medium text-gray-700">
                Upload image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={onChange}
                className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 hover:file:bg-gray-200"
              />
            </label>

            <div className="flex-none">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-md shadow"
              >
                {loading ? "Checking..." : "Check Liveness"}
              </button>
            </div>
          </div>

          {preview && (
            <div className="mt-2 flex items-start gap-4">
              <div>
                <span className="text-sm text-gray-600">Preview:</span>
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-40 h-40 object-cover rounded-lg border"
                  />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">
                  File: {file?.name} — {((file?.size ?? 0) / 1024) | 0} KB
                </p>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6">
          <h2 className="text-lg font-medium">Result</h2>
          {error && <p className="text-red-600 mt-2">Error: {error}</p>}

          {result ? (
            <div className="mt-3 bg-gray-50 p-4 rounded-md border max-w-md">
              <div className="text-lg font-semibold mb-2">
                Face is{" "}
                {result.isLive ? (
                  <span className="text-green-600">LIVE</span>
                ) : (
                  <span className="text-red-600">NOT LIVE</span>
                )}
              </div>
              <div className="text-sm text-gray-700">
                Realness Score:{" "}
                <span className="font-mono">{result.score}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">No result yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
