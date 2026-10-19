"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import { compareFacesAction } from "@/lib/actions/faceSimilarity.actions";
import { FiCheckSquare, FiArrowRight } from "react-icons/fi";
import Dropzone from "@/components/ui/Dropzone";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

type ApiSuccess = {
  confidence: number;
  ok: boolean;
  message: string;
};

export default function FaceSimilarityPage() {
  const [mainPhoto, setMainPhoto] = useState<File | null>(null);
  const [testPhoto, setTestPhoto] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [testPreview, setTestPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiSuccess | null>(null);

  const handleMainSelect = (file: File | null) => {
    setMainPhoto(file);
    if (file) {
      setMainPreview(URL.createObjectURL(file));
    } else {
      setMainPreview(null);
    }
  };

  const handleTestSelect = (file: File | null) => {
    setTestPhoto(file);
    if (file) {
      setTestPreview(URL.createObjectURL(file));
    } else {
      setTestPreview(null);
    }
  };

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
          `Comparison complete! Score: ${data.confidence}% — ${
            data.confidence > 80 ? "Matched Identity" : "Different Person"
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

  const isMatched = result && result.confidence > 80;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Badge variant="live" className="mb-3">
            Interactive Playground
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            1:1 Face Similarity Verification
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Test our biometric vector matching engine by uploading two facial images to evaluate identity match confidence.
          </p>
        </div>

        {/* Upload Container Card */}
        <form onSubmit={handleSubmit} className="glass-panel-elevated p-6 sm:p-10 rounded-3xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Reference Image (e.g. ID)
              </span>
              <Dropzone
                onFileSelect={handleMainSelect}
                selectedFile={mainPhoto}
                previewUrl={mainPreview}
                label="Upload Reference Image"
                description="JPEG or PNG photo"
              />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Candidate Image (e.g. Live Selfie)
              </span>
              <Dropzone
                onFileSelect={handleTestSelect}
                selectedFile={testPhoto}
                previewUrl={testPreview}
                label="Upload Candidate Image"
                description="JPEG or PNG photo"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex justify-center">
            <Button
              type="submit"
              size="lg"
              isLoading={loading}
              disabled={!mainPhoto || !testPhoto || loading}
              rightIcon={<FiArrowRight size={18} />}
            >
              Run Similarity Comparison
            </Button>
          </div>

          {/* Results Card */}
          {result && (
            <div className="mt-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-center space-y-3">
              <Badge variant={isMatched ? "verified" : "danger"} size="md">
                {isMatched ? "Likely Same Person" : "Different Person Detected"}
              </Badge>
              <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                {result.confidence}% Match Confidence
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Threshold for high-assurance verification is 80.0%.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}