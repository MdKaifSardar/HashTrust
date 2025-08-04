"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string>("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // ✅ must match FastAPI parameter name

    try {
      const res = await fetch("https://face-extraction-from-doc.onrender.com/api/v1/face/detect-face", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.message || err?.error || "Face extraction failed!");
        return;
      }

      // Try to get a message from the headers or response if available
      const apiMessage = res.headers.get("x-message");
      if (apiMessage) {
        toast.success(apiMessage);
      } else {
        toast.success("Face extracted successfully!");
      }

      const blob = await res.blob();
      setResultImage(URL.createObjectURL(blob));
    } catch (error: any) {
      toast.error(error?.message || "An error occurred while extracting the face.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Face Extraction Tool</h1>

      <form
        onSubmit={handleUpload}
        className="flex flex-col items-center space-y-3"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="p-2 border border-gray-400 rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Upload & Extract
        </button>
      </form>

      {resultImage && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Extracted Face:</h2>
          <img
            src={resultImage}
            alt="Extracted Face"
            className="max-w-sm rounded-lg shadow-lg border"
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
