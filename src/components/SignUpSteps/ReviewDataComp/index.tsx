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
import { toast, ToastContainer } from "react-toastify";
import {
  selectPreviewUrl,
  selectIdentityDocumentFile,
} from "../../../redux/features/idUpload/idUploadSlice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const labelClass = "font-semibold text-gray-700";
const valueClass = "text-gray-800";
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
      if (result.sessionCookie) {
        document.cookie = `session=${result.sessionCookie}; path=/; max-age=${
          60 * 60 * 24 * 5
        }; SameSite=Strict; Secure`;
        toast.success(result.message || "Sign up successful!");
        setTimeout(() => {
          router.push("/pages/user/dashboard");
        }, 1200);
      } else if (result.message) {
        toast.error(result.message);
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
    <>
      <ToastContainer />
      <div className="pt-16 sm:py-0 min-h-screen justify-center items-center h-full flex flex-col gap-8 w-full relative">
        {/* Top navigation buttons at top corners */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center px-2 py-2 z-10">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center justify-center w-12 h-12 rounded-full font-semibold bg-gray-200 text-blue-700 hover:bg-gray-300"
          >
            <FiChevronLeft size={28} />
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center justify-center w-32 h-12 rounded-full font-semibold bg-green-600 text-white hover:bg-green-700 text-base"
          >
            Submit
          </button>
        </div>

        <div className="sm:p-0 p-4 w-full flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 text-center sm:text-left">
            Review Your Data
          </h2>
          <div className="w-full max-w-4xl bg-white rounded-xl shadow border border-blue-100 flex flex-col sm:flex-row gap-8 sm:gap-12 px-4 sm:px-8 py-4 sm:py-8 ">
            {/* Left: Personal Info & Address */}
            <div className="w-full flex flex-col gap-6">
              <div>
                <h3 className={sectionTitleClass}>Personal Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={labelClass}>Name:</span>
                    <span className={valueClass}>
                      {userData.name || (
                        <span className="text-red-500">Not available</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={labelClass}>Date of Birth:</span>
                    <span className={valueClass}>
                      {userData.dob || (
                        <span className="text-red-500">Not available</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={labelClass}>Phone:</span>
                    <span className={valueClass}>
                      {userData.phone || (
                        <span className="text-red-500">Not available</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className={sectionTitleClass}>Address</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={labelClass}>PO:</span>
                    <span className={valueClass}>
                      {userData.address?.po || (
                        <span className="text-red-500">Not available</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={labelClass}>District:</span>
                    <span className={valueClass}>
                      {userData.address?.district || (
                        <span className="text-red-500">Not available</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={labelClass}>State:</span>
                    <span className={valueClass}>
                      {userData.address?.state || (
                        <span className="text-red-500">Not available</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={labelClass}>Pin:</span>
                    <span className={valueClass}>
                      {userData.address?.pin || (
                        <span className="text-red-500">Not available</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              {/* Password and Email */}
              {userData.password && (
                <div>
                  <h3 className={sectionTitleClass}>
                    Password and Email Address
                  </h3>
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
            </div>
            {/* Right: Images & Verification */}
            <div className="w-full flex flex-col gap-6">
              <div>
                <h3 className={sectionTitleClass}>Images</h3>
                <div className="flex gap-8 justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-600 mb-1">
                      ID Card Face
                    </span>
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
              <div>
                <h3 className={sectionTitleClass}>Verification Status</h3>
                <div className="space-y-2">
                  <div className="flex flex-col gap-2">
                    {/* Face Liveness */}
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 text-base">
                        Face Liveness:
                      </span>
                      <span
                        className={`font-semibold text-base ${
                          faceLiveness === null
                            ? "text-gray-500"
                            : faceLiveness
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {faceLiveness === null
                          ? "Not checked"
                          : faceLiveness
                          ? "LIVE"
                          : "NOT LIVE"}
                      </span>
                      {faceLivenessScore !== null && (
                        <span className="text-base font-semibold text-green-600">
                          (Score: {faceLivenessScore}/10)
                        </span>
                      )}
                    </div>
                    {/* Face Similarity */}
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 text-base">
                        Face Similarity:
                      </span>
                      <span
                        className={`font-semibold text-base ${
                          similarityScore === null
                            ? "text-gray-500"
                            : isMatch
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {similarityScore === null
                          ? "Not checked"
                          : isMatch
                          ? `Match (${similarityScore})`
                          : `No Match (${similarityScore})`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
      </div>
    </>
  );
};

export default ReviewDataComp;
