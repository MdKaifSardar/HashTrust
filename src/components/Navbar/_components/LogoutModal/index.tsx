import React from "react";
import { motion } from "framer-motion";

const LogoutModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
  <motion.div
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <h3 className="text-lg font-bold text-blue-700 mb-4">Confirm Logout</h3>
      <p className="mb-6 text-gray-700 text-center">Are you sure you want to logout?</p>
      <div className="flex gap-4">
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default LogoutModal;
