"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectUserData } from "../../../redux/features/userData/userDataSlice";
import { selectFaceImage } from "../../../redux/features/idUpload/idUploadSlice";
import {
  selectUserImagePreview,
  selectLatestUserImagePreview,
  selectFaceLiveness,
  selectFaceLivenessScore,
} from "../../../redux/features/userImage/userImageSlice";
import { selectFaceSimilarityCheck } from "../../../redux/features/faceSimilarityCheckSlice/faceSImilarityCheckSlice";
import {
  setCurrentStep,
  selectCurrentStep,
} from "../../../redux/features/signUpSteps/stepSlice";
import ReviewDataModal from "./_components/ReviewDataModal";
import { createUser } from "@/lib/actions/user.actions";
import { toast } from "react-toastify";
import {
  selectPreviewUrl,
  selectIdentityDocumentFile,
} from "../../../redux/features/idUpload/idUploadSlice";

const labelClass = "font-semibold text-gray-700";
const valueClass = "text-gray-700";
const sectionTitleClass = "font-semibold text-lg mb-2 text-blue-700";

const ReviewDataComp: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector(selectUserData);
  const idFaceImage = useSelector(selectFaceImage);
  const userImage = useSelector(selectUserImagePreview);
  const latestUserImage = useSelector(selectLatestUserImagePreview);
  const faceLiveness = useSelector(selectFaceLiveness);
  const faceLivenessScore = useSelector(selectFaceLivenessScore);
  const { similarityScore, isMatch } = useSelector(selectFaceSimilarityCheck);
  const currentStep = useSelector(selectCurrentStep);
  const previewUrl = useSelector(selectPreviewUrl);
  const identityDocumentFile = useSelector(selectIdentityDocumentFile);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePrev = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  const handleSubmit = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalConfirm = async () => {
    setSubmitting(true);
    try {
      // Prepare verification status object
      const verificationStatus = {
        faceLiveness: {
          status:
            faceLiveness === true
              ? "LIVE"
              : faceLiveness === false
              ? "NOT LIVE"
              : "NOT CHECKED",
          score: faceLivenessScore ?? null,
        },
        faceSimilarity: {
          status:
            similarityScore === null
              ? "NOT CHECKED"
              : isMatch
              ? "MATCH"
              : "NO MATCH",
          score: similarityScore ?? null,
        },
      };

      // Always send the File object if available, else fallback to previewUrl (base64 string)
      let idDocToSend: File | string | undefined = identityDocumentFile;
      if (!idDocToSend && previewUrl) {
        idDocToSend = previewUrl;
      }
      const result = await createUser(
        userData.name || "",
        userData.email || "",
        userData.password || "",
        latestUserImage || userImage,
        userData.phone || "",
        JSON.stringify(userData.address || {}),
        userData.dob || "",
        previewUrl,
        verificationStatus
      );
      setShowModal(false);
      if (result.idToken) {
        localStorage.setItem("authToken", result.idToken);
        window.dispatchEvent(new Event("authTokenChanged")); // <-- force Navbar to update
        toast.success(result.message || "Sign up successful!");
        setTimeout(() => {
          router.push("/pages/user/dashboard");
        }, 1200);
      } else if (result.message) {
        toast.error(result.message);
      } else if (result.error) {
        toast.error(result.error);
      } else {
        toast.error("Sign up failed.");
      }
    } catch (e: any) {
      toast.error("Failed to submit data: " + (e?.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-700 text-center">
        Review Your Data
      </h2>
      {/* User Info */}
      <div>
        <h3 className={sectionTitleClass}>Personal Info</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <span className={labelClass}>Name:</span>{" "}
            <span className={valueClass}>
              {userData.name || (
                <span className="text-red-500">Not available</span>
              )}
            </span>
          </li>
          <li>
            <span className={labelClass}>Date of Birth:</span>{" "}
            <span className={valueClass}>
              {userData.dob || (
                <span className="text-red-500">Not available</span>
              )}
            </span>
          </li>
          <li>
            <span className={labelClass}>Phone:</span>{" "}
            <span className={valueClass}>
              {userData.phone || (
                <span className="text-red-500">Not available</span>
              )}
            </span>
          </li>
        </ul>
      </div>

      {/* Address */}
      <div>
        <h3 className={sectionTitleClass}>Address</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <span className={labelClass}>PO:</span>{" "}
            <span className={valueClass}>
              {userData.address?.po || (
                <span className="text-red-500">Not available</span>
              )}
            </span>
          </li>
          <li>
            <span className={labelClass}>District:</span>{" "}
            <span className={valueClass}>
              {userData.address?.district || (
                <span className="text-red-500">Not available</span>
              )}
            </span>
          </li>
          <li>
            <span className={labelClass}>State:</span>{" "}
            <span className={valueClass}>
              {userData.address?.state || (
                <span className="text-red-500">Not available</span>
              )}
            </span>
          </li>
          <li>
            <span className={labelClass}>Pin:</span>{" "}
            <span className={valueClass}>
              {userData.address?.pin || (
                <span className="text-red-500">Not available</span>
              )}
            </span>
          </li>
        </ul>
      </div>

      {/* Images */}
      <div>
        <h3 className={sectionTitleClass}>Images</h3>
        <div className="flex gap-8 justify-center">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 mb-1">ID Card Face</span>
            {idFaceImage ? (
              <img
                src={idFaceImage}
                alt="ID Face"
                className="w-24 h-24 object-cover rounded border"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded border flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 mb-1">
              Latest User Photo
            </span>
            {latestUserImage ? (
              <img
                src={latestUserImage}
                alt="User"
                className="w-24 h-24 object-cover rounded border"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded border flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div>
        <h3 className={sectionTitleClass}>Verification Status</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <span className={labelClass}>Face Liveness:</span>{" "}
            {faceLiveness === null ? (
              <span className="text-yellow-600 font-semibold">Not checked</span>
            ) : faceLiveness ? (
              <span className="text-green-600 font-semibold">LIVE</span>
            ) : (
              <span className="text-red-600 font-semibold">NOT LIVE</span>
            )}
            {faceLivenessScore !== null && (
              <span className="ml-2 text-xs text-gray-500">
                (Score: {faceLivenessScore}/10)
              </span>
            )}
          </li>
          <li>
            <span className={labelClass}>Face Similarity:</span>{" "}
            {similarityScore === null ? (
              <span className="text-yellow-600 font-semibold">Not checked</span>
            ) : isMatch ? (
              <span className="text-green-600 font-semibold">
                Match ({similarityScore})
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                No Match ({similarityScore})
              </span>
            )}
          </li>
        </ul>
      </div>

      {/* Password and Email */}
      {userData.password && (
        <div>
          <h3 className={sectionTitleClass}>Password and Email Address</h3>
          <div className="flex items-center gap-2">
            <span className="font-mono select-all text-gray-700">
              Password:{" "}
              {showPassword
                ? userData.password
                : "•".repeat(userData.password.length)}
            </span>
            <button
              type="button"
              className="text-blue-600 underline text-sm"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="mt-2 text-gray-700 text-sm">
            <span className={labelClass}>Email:</span>{" "}
            <span className={valueClass}>
              {userData.email || (
                <span className="text-red-500">Not available</span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 justify-center mt-2">
        <button
          type="button"
          onClick={handlePrev}
          className="px-6 py-2 rounded font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700"
        >
          Submit
        </button>
      </div>
      {showModal && (
        <ReviewDataModal
          open={showModal}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          userData={userData}
          userImage={latestUserImage || userImage}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default ReviewDataComp;
