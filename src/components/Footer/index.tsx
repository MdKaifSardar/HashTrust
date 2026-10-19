"use client";
import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full bg-gradient-to-br from-blue-800 via-blue-900 to-blue-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:border-t dark:border-slate-800 text-white dark:text-slate-200 py-8 px-4 transition-colors">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-2xl font-extrabold tracking-tight drop-shadow-lg font-sans mb-2 text-white dark:text-cyan-400">
          HashTrust
        </span>
        <span className="text-sm font-medium text-white/80 dark:text-slate-400">
          Empowering secure, privacy-first onboarding for everyone.
        </span>
      </div>
      <div className="text-xs text-white/70 dark:text-slate-500 text-center md:text-right">
        &copy; {new Date().getFullYear()} HashTrust. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;