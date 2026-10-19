"use client";

import React from "react";
import { FiShield } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface ReviewDataModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userData: any;
  userImage: string | undefined;
  submitting: boolean;
}

export const ReviewDataModal: React.FC<ReviewDataModalProps> = ({
  open,
  onClose,
  onConfirm,
  submitting,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-white/10 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 mx-auto flex items-center justify-center">
          <FiShield size={22} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Confirm Blockchain Minting
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Your biometric signature and verification proof hash will be permanently anchored to the Ethereum Sepolia smart contract. This action creates your self-sovereign identity passport.
        </p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            size="md"
            onClick={onConfirm}
            isLoading={submitting}
          >
            {submitting ? "Anchoring on Sepolia..." : "Confirm & Mint"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDataModal;
