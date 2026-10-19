"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import Button from "@/components/ui/Button";

export const LogoutModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <motion.div
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onCancel}
  >
    <motion.div
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center transition-colors"
      initial={{ scale: 0.95, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 10 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mb-4 border border-rose-100 dark:border-rose-900/50">
        <FiLogOut size={22} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Sign Out
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Are you sure you want to end your session? You will need to log back in to access your dashboard.
      </p>
      <div className="grid grid-cols-2 gap-3 w-full">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Sign Out
        </Button>
      </div>
    </motion.div>
  </motion.div>
);

export default LogoutModal;
