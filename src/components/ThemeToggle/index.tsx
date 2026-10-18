"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid layout shift before mount
    return (
      <div className={`w-9 h-9 rounded-full bg-slate-200/50 dark:bg-slate-800/50 ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full p-2 text-slate-700 dark:text-cyan-400 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${className}`}
    >
      <motion.div
        key={isDark ? "dark" : "light"}
        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {isDark ? (
          <FiSun className="w-4 h-4 text-amber-400" />
        ) : (
          <FiMoon className="w-4 h-4 text-slate-700" />
        )}
      </motion.div>
    </motion.button>
  );
}
