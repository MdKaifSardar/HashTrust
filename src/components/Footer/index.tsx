"use client";
import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full bg-gradient-to-br from-blue-800 via-blue-900 to-blue-700 text-white py-8 px-4">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-2xl font-extrabold tracking-tight drop-shadow-lg font-sans mb-2">
          HashTrust
        </span>
        <span className="text-sm font-medium text-white/80">
          Empowering secure, privacy-first onboarding for everyone.
        </span>
      </div>
      <div className="text-xs text-white/70 text-center md:text-right">
        &copy; {new Date().getFullYear()} HashTrust. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;