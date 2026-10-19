"use client";

import React, { useState, useEffect } from "react";
import { useLivenessDetector } from "@/utils/hooks/LivenessDetector";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCamera, FiArrowRight } from "react-icons/fi";
import Dropzone from "@/components/ui/Dropzone";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function LivenessPage() {
  const { loading, result, error, checkLiveness } = useLivenessDetector();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image first");
      return;
    }
    try {
      await checkLiveness(file);
      toast.success("Passive liveness scan completed");
    } catch (err: any) {
      toast.error(`Liveness check failed: ${err?.message ?? err}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors py-12 px-4 sm:px-6">
      <ToastContainer position="top-right" />
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Badge variant="live" className="mb-3">
            Anti-Spoofing Playground
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Silent Face Liveness Detection
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Upload any selfie to test our passive anti-spoofing engine against replay attacks, screens, and silicone masks.
          </p>
        </div>

        {/* Upload Container Card */}
        <form onSubmit={onSubmit} className="glass-panel-elevated p-6 sm:p-10 rounded-3xl space-y-6">
          <Dropzone
            onFileSelect={handleFileSelect}
            selectedFile={file}
            previewUrl={preview}
            label="Upload photo to evaluate"
            description="JPEG or PNG front-facing image"
          />

          <div className="pt-2 flex justify-center">
            <Button
              type="submit"
              size="lg"
              isLoading={loading}
              disabled={!file || loading}
              rightIcon={<FiArrowRight size={18} />}
            >
              Analyze Face Liveness
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium text-center">
              {error}
            </div>
          )}

          {/* Results Card */}
          {result && (
            <div className="mt-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-center space-y-3">
              <Badge variant={result.isLive ? "verified" : "danger"} size="md">
                {result.isLive ? "Face Verified: LIVE" : "Face Flagged: NOT LIVE / SPOOF"}
              </Badge>
              <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                Realness Score: {result.score}/10
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Single-frame passive inference via neural anti-spoof model.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
