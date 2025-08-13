"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIdentityDocumentFile } from "../../../redux/features/idUpload/idUploadSlice";
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

const DataExtractDocComp: React.FC = () => {
  const dispatch = useDispatch();
  const identityDocumentFile = useSelector(selectIdentityDocumentFile);
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

  const handleExtract = async () => {
    if (!identityDocumentFile) {
      dispatch(resetUserData());
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

  // Always run when component mounts & when file changes
  useEffect(() => {
    handleExtract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identityDocumentFile]);

  const handleNext = () => {
    if (hasExtractedData) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Extracted User Data
      </h2>

      {loading && <div className="text-blue-600 mb-4">Extracting data...</div>}

      {!loading && hasExtractedData && (
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <span className="font-semibold">Name:</span> {userData.name}
          </li>
          <li>
            <span className="font-semibold">Date of Birth:</span> {userData.dob}
          </li>
          <li>
            <span className="font-semibold">Phone Number:</span>{" "}
            {userData.phone}
          </li>
          <li>
            <span className="font-semibold">Address:</span>
            <ul className="ml-6 list-disc">
              <li>
                <span className="font-semibold">PO:</span> {userData.address.po}
              </li>
              <li>
                <span className="font-semibold">District:</span>{" "}
                {userData.address.district}
              </li>
              <li>
                <span className="font-semibold">State:</span>{" "}
                {userData.address.state}
              </li>
              <li>
                <span className="font-semibold">Pin Code:</span>{" "}
                {userData.address.pin}
              </li>
            </ul>
          </li>
        </ul>
      )}

      {!loading && !hasExtractedData && (
        <div className="text-red-500">No data extracted.</div>
      )}

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-2 rounded shadow font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Back
        </button>

        {identityDocumentFile && (
          <button
            type="button"
            onClick={handleExtract}
            disabled={loading}
            className={`px-6 py-2 rounded shadow font-semibold ${
              loading
                ? "bg-yellow-300 text-white cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            Re-extract
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={!hasExtractedData}
          className={`px-6 py-2 rounded shadow font-semibold ${
            !hasExtractedData
              ? "bg-green-300 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataExtractDocComp;
