"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { FiArrowLeft, FiShield, FiCheckCircle, FiCheck, FiLock, FiAlertTriangle } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export const ReviewDataComp: React.FC = () => {
  const dispatch = useDispatch();
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handlePrev = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  const handleSubmit = () => {
    setSubmitError(null);
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
        verificationStatus,
        "user",
        userData.idNumber || ""
      );
      setShowModal(false);
      if (result.ok && result.sessionCookie) {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        document.cookie = `session=${result.sessionCookie}; path=/; max-age=${
          60 * 60 * 24 * 5
        }; SameSite=Lax${isSecure ? "; Secure" : ""}`;
        toast.success(result.message || "Identity proof created successfully!");
        setTimeout(() => {
          window.location.href = "/pages/user/dashboard";
        }, 1000);
      } else {
        const msg = result.message || "Minting failed. Your data is preserved; please retry.";
        setSubmitError(msg);
        toast.error(msg);
      }
    } catch (e: any) {
      const msg = "Failed to submit data: " + (e?.message || "Unknown error");
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const displayUserImage = latestUserImage || userImage;

  return (
    <div className="w-full flex flex-col">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
            <FiShield size={18} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Review & Anchor Identity
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Verify your information before generating your cryptographic identity proof.
            </p>
          </div>
        </div>
      </div>

      {/* Retry Alert Banner if Minting Failed */}
      {submitError && (
        <div className="p-4 mb-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
          <FiAlertTriangle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
          <div className="flex-1 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
            <p className="font-bold mb-1">Blockchain Anchoring Could Not Complete</p>
            <p className="text-xs text-amber-700 dark:text-amber-300">{submitError}</p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2">
              Your verified details are preserved. You can click <strong>"Confirm & Mint Identity Proof"</strong> below to retry.
            </p>
          </div>
        </div>
      )}

      {/* Digital Identity Passport Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-sky-50/20 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-white/10 shadow-lg relative overflow-hidden">
        {/* Hologram top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400" />

        {/* Passport Top: Photo & Basic Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-200/80 dark:border-white/10">
          <div className="relative">
            {displayUserImage ? (
              <img
                src={displayUserImage}
                alt="User Biometric Avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-sky-500 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                No Photo
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-emerald-500 text-white shadow">
              <FiCheck size={14} />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {userData.name || "Verified Holder"}
              </h3>
              <Badge variant="verified" size="sm">
                Self-Sovereign
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
              {userData.email}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Gov ID: <strong className="font-mono text-slate-800 dark:text-slate-200">{userData.idNumber}</strong> • DOB: {userData.dob}
            </p>
          </div>
        </div>

        {/* Status Verification Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6 border-b border-slate-200/80 dark:border-white/10">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Biometric Liveness
            </span>
            <Badge variant={faceLiveness ? "verified" : "danger"} size="sm">
              {faceLiveness ? `LIVE (${faceLivenessScore}/10)` : "NOT LIVE"}
            </Badge>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              1:1 Biometric Match
            </span>
            <Badge variant={isMatch ? "verified" : "danger"} size="sm">
              {isMatch ? `MATCHED (${similarityScore}%)` : "FAILED"}
            </Badge>
          </div>
        </div>

        {/* Address and ID Details */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-400 block mb-1">Registered Address</span>
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              {userData.address?.po}, {userData.address?.district}, {userData.address?.state} - {userData.address?.pin}
            </p>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block mb-1">Phone Contact</span>
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              {userData.phone || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={submitting}
          leftIcon={<FiArrowLeft size={16} />}
        >
          Back
        </Button>
        <Button
          variant="success"
          size="lg"
          onClick={handleSubmit}
          isLoading={submitting}
          rightIcon={<FiCheckCircle size={18} />}
        >
          Confirm & Mint Identity Proof
        </Button>
      </div>

      {showModal && (
        <ReviewDataModal
          open={showModal}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          userData={userData}
          userImage={displayUserImage}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default ReviewDataComp;
