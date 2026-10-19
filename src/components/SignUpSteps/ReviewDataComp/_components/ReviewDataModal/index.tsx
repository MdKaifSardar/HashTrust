import React from "react";

interface ReviewDataModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userData: any;
  userImage: string | undefined;
  submitting: boolean;
}

const ReviewDataModal: React.FC<ReviewDataModalProps> = ({
  open,
  onClose,
  onConfirm,
  submitting,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md shadow-xl border border-transparent dark:border-slate-800 transition-colors">
        <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-slate-100">Confirm Submission</h3>
        <div className="mb-4 text-gray-700 dark:text-slate-300">
          Are you sure you want to submit your data? This action cannot be undone.
        </div>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-700 font-semibold transition"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-semibold transition shadow"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDataModal;
