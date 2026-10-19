"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiShield, FiArrowRight, FiCheckCircle, FiLock, FiCpu, FiExternalLink } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const HeroSectionComponent = () => {
  const [simStep, setSimStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 sm:pt-20 pb-20 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center">
      {/* Top Trust Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs sm:text-sm font-medium shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
          </span>
          <span>Next-Gen Identity & Anti-Spoofing Protocol</span>
        </div>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-center max-w-4xl leading-[1.1] text-slate-900 dark:text-white"
      >
        Self-Sovereign Identity.
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400">
          Anchored on Blockchain.
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 text-center max-w-2xl leading-relaxed"
      >
        Prevent fraud, deepfakes, and identity theft with passive AI face liveness detection. Hashed and cryptographically proven on Ethereum smart contracts.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
      >
        <Link href="/pages/auth/sign-up/user" className="w-full sm:w-auto">
          <Button size="lg" fullWidth rightIcon={<FiArrowRight size={18} />}>
            Verify Personal Identity
          </Button>
        </Link>
        <Link href="/pages/auth/login/organisation" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" fullWidth leftIcon={<FiCpu size={18} />}>
            Organisation API Keys
          </Button>
        </Link>
      </motion.div>

      {/* Interactive Verification Simulator Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-14 w-full max-w-2xl"
      >
        <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl relative overflow-hidden">
          {/* Subtle Top Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400" />

          {/* Simulator Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40">
                <FiShield size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Live Verification Pipeline
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  HashTrust Verifier v2.4
                </p>
              </div>
            </div>

            <Badge
              variant={simStep === 2 ? "verified" : simStep === 1 ? "live" : "info"}
            >
              {simStep === 0
                ? "Extracting Document"
                : simStep === 1
                ? "Checking Liveness"
                : "Proof Anchored"}
            </Badge>
          </div>

          {/* Simulation Content Body */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            {/* Stage 1: Document OCR */}
            <div
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                simStep >= 0
                  ? "bg-slate-50/80 dark:bg-slate-900/60 border-sky-500/30 shadow-sm"
                  : "bg-transparent border-slate-200/50 dark:border-white/5 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Document OCR</span>
                <FiCheckCircle size={14} className={simStep >= 0 ? "text-emerald-500" : "text-slate-400"} />
              </div>
              <p className="text-xs font-mono text-slate-800 dark:text-slate-200 truncate">
                Gov ID Verified
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Confidence: 99.4%</p>
            </div>

            {/* Stage 2: Biometric Liveness */}
            <div
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                simStep >= 1
                  ? "bg-slate-50/80 dark:bg-slate-900/60 border-sky-500/30 shadow-sm"
                  : "bg-transparent border-slate-200/50 dark:border-white/5 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Face Liveness</span>
                <FiCheckCircle size={14} className={simStep >= 1 ? "text-emerald-500" : "text-slate-400"} />
              </div>
              <p className="text-xs font-mono text-slate-800 dark:text-slate-200">
                Silent Spoof Check
              </p>
              <p className="text-[10px] text-emerald-500 mt-1 font-mono">Status: LIVE</p>
            </div>

            {/* Stage 3: Blockchain Hash */}
            <div
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                simStep === 2
                  ? "bg-slate-50/80 dark:bg-slate-900/60 border-emerald-500/40 shadow-sm"
                  : "bg-transparent border-slate-200/50 dark:border-white/5 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Smart Contract</span>
                <FiLock size={14} className={simStep === 2 ? "text-emerald-500" : "text-slate-400"} />
              </div>
              <p className="text-xs font-mono text-slate-800 dark:text-slate-200 truncate">
                0x8e21...f9a4
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Block: #6482104</p>
            </div>
          </div>

          {/* Verification Bar Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200/80 dark:border-white/10 gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Gas-efficient Keccak256 proof anchor
            </span>
            <Link
              href="/pages/demo"
              className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium hover:underline"
            >
              <span>Test interactive demo</span>
              <FiExternalLink size={12} />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSectionComponent;