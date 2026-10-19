"use client";

import React, { useState, useRef } from "react";
import { FiUploadCloud, FiFile, FiTrash2, FiCheckCircle } from "react-icons/fi";

export interface DropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
  accept?: string;
  label?: string;
  description?: string;
  className?: string;
  previewUrl?: string | null;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelect,
  selectedFile,
  accept = "image/*",
  label = "Upload a file",
  description = "PNG, JPG or PDF up to 10MB",
  className = "",
  previewUrl,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
        isDragOver
          ? "border-sky-500 bg-sky-50/50 dark:bg-sky-950/20"
          : "border-slate-200 dark:border-white/10 hover:border-sky-400 dark:hover:border-sky-500/50 bg-slate-50/50 dark:bg-slate-900/50"
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative group w-full flex flex-col items-center">
          <div className="relative max-h-56 max-w-sm rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
            <img
              src={previewUrl}
              alt="Uploaded file preview"
              className="object-contain w-full h-full max-h-56"
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <FiCheckCircle size={14} /> File loaded
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title="Remove file"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      ) : selectedFile ? (
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-3.5 rounded-xl">
          <FiFile size={24} className="text-sky-500" />
          <div className="text-left">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-400">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 ml-2"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40 mb-3">
            <FiUploadCloud size={28} />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
            {label}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            {description}
          </p>
          <span className="mt-3 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200/60 dark:border-sky-800/40">
            Browse Files
          </span>
        </>
      )}
    </div>
  );
};

export default Dropzone;
