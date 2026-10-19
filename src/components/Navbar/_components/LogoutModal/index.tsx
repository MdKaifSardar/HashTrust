import React from "react";
import { motion } from "framer-motion";

const LogoutModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
  <motion.div
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center transition-colors"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <h3 className="text-xl font-bold text-blue-700 dark:text-cyan-400 mb-3">Confirm Logout</h3>
      <p className="mb-6 text-gray-700 dark:text-slate-300 text-center text-sm">
        Are you sure you want to log out of your account?
      </p>
      <div className="flex gap-4 w-full justify-center">
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500/50"
        >
          Logout
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-200 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-slate-400/50"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default LogoutModal;
