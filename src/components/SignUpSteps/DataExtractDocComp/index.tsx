"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIdentityDocumentFile,
  selectPreviewUrl,
  selectLastUploadedFile,
} from "../../../redux/features/idUpload/idUploadSlice";
import { extractUserDataWithGemini } from "../../../lib/actions/dataExtract.actions";
import {
  setUserData,
  resetUserData,
  selectUserData,
} from "../../../redux/features/userData/userDataSlice";
import {
  setCurrentStep,
  selectCurrentStep,
} from "../../../redux/features/signUpSteps/stepSlice";
import { toast } from "react-toastify";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const DataExtractDocComp: React.FC = () => {
  const dispatch = useDispatch();
  const identityDocumentFile = useSelector(selectIdentityDocumentFile);
  const previewUrl = useSelector(selectPreviewUrl);
  const lastUploadedFile = useSelector(selectLastUploadedFile);
  const userData = useSelector(selectUserData);
  const currentStep = useSelector(selectCurrentStep);

  const [loading, setLoading] = useState(false);

  const hasExtractedData =
    !!userData?.name &&
    !!userData?.dob &&
    !!userData?.phone &&
    !!userData?.address?.po &&
    !!userData?.address?.district &&
    !!userData?.address?.state &&
    !!userData?.address?.pin;

  // Only reset user data when a new file is uploaded (using lastUploadedFile from Redux)
  useEffect(() => {
    if (
      identityDocumentFile &&
      identityDocumentFile !== lastUploadedFile
    ) {
      dispatch(resetUserData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identityDocumentFile, lastUploadedFile]);

  const handleExtract = async () => {
    if (!identityDocumentFile) {
      toast.error("No document uploaded.");
      return;
    }
    setLoading(true);
    try {
      const data = await extractUserDataWithGemini(identityDocumentFile);

      if (!data || Object.keys(data).length === 0) {
        dispatch(resetUserData());
        toast.error("No data extracted from the document.");
      } else {
        dispatch(setUserData(data));
        toast.success("User data extracted successfully!");
      }
    } catch (err: any) {
      dispatch(resetUserData());
      toast.error(err?.message || "Failed to extract user data");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (hasExtractedData) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  return (
    <div className="bg-transparent flex flex-col justify-center items-center w-full min-h-screen h-full rounded-lg relative">
      {/* Top navigation buttons at top corners */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-2 py-2 z-10">
        <button
          type="button"
          onClick={handleBack}
          disabled={loading}
          className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition
          ${
            loading
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-blue-700 hover:bg-gray-300"
          }`}
        >
          <FiChevronLeft size={28} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!hasExtractedData || loading}
          className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition
          ${
            !hasExtractedData || loading
              ? "bg-green-300 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          <FiChevronRight size={28} />
        </button>
      </div>

      <div className="w-full flex flex-col items-center mt-10 sm:mt-0">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center w-full">
          Extracted User Data
        </h2>
        <div className="p-4 w-full flex flex-col sm:flex-row items-start justify-center gap-8">
          {/* Left: Uploaded document preview and extract button */}
          <div className="w-full sm:w-1/2 flex flex-col items-center">
            <div className="w-full bg-white rounded-lg shadow mb-4 border border-blue-100 flex flex-col items-center p-[1rem]">
              {/* Uploaded document preview */}
              {previewUrl && (
                <div className="w-full flex justify-center mb-4">
                  <img
                    src={previewUrl}
                    alt="Uploaded Document Preview"
                    className="w-48 h-auto rounded border border-gray-300"
                  />
                </div>
              )}
              <div className="flex mb-2 justify-center w-full">
                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={loading || !identityDocumentFile}
                  className={`px-6 py-2 rounded shadow font-semibold ${
                    loading || !identityDocumentFile
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {loading
                    ? "Extracting..."
                    : hasExtractedData
                    ? "Re-extract"
                    : "Extract Data"}
                </button>
              </div>
              {!loading && !hasExtractedData && (
                <div className="text-red-500">No data extracted.</div>
              )}
            </div>
          </div>
          {/* Right: Extracted data */}
          <div className="w-full sm:w-1/2 flex flex-col items-center">
            {hasExtractedData && (
              <div className="w-full bg-white rounded-lg shadow mb-4 border border-blue-100 flex flex-col justify-center items-center p-[1rem]">
                <h3 className="text-lg font-semibold text-blue-700 mb-4 text-center">
                  User Information
                </h3>
                <div className="grid grid-cols-1 gap-3 w-full">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Name:</span>
                    <span className="text-gray-800">{userData.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Date of Birth:</span>
                    <span className="text-gray-800">{userData.dob}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Phone Number:</span>
                    <span className="text-gray-800">{userData.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Aadhaar Number:</span>
                    <span className="text-gray-800">{userData.idNumber}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-gray-700 mb-1">Address:</span>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <span className="text-gray-600">PO:</span>
                      <span className="text-gray-800">{userData.address.po}</span>
                      <span className="text-gray-600">District:</span>
                      <span className="text-gray-800">{userData.address.district}</span>
                      <span className="text-gray-600">State:</span>
                      <span className="text-gray-800">{userData.address.state}</span>
                      <span className="text-gray-600">Pin Code:</span>
                      <span className="text-gray-800">{userData.address.pin}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExtractDocComp;