"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiFileText, FiCamera, FiCheckSquare, FiShield } from "react-icons/fi";
import Badge from "@/components/ui/Badge";

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Document OCR Extraction",
    description: "Instant high-accuracy extraction of name, government ID number, and date of birth from official identity documents.",
    icon: <FiFileText size={22} />,
  },
  {
    step: "02",
    title: "Silent Liveness Defense",
    description: "Single-frame biometric analysis detects deepfakes, paper cutouts, masks, and digital replays without awkward user prompts.",
    icon: <FiCamera size={22} />,
  },
  {
    step: "03",
    title: "1:1 Biometric Match",
    description: "High-dimensional facial landmark vector embedding compares the document photo against the live capture.",
    icon: <FiCheckSquare size={22} />,
  },
  {
    step: "04",
    title: "Blockchain Proof Anchor",
    description: "Generates an immutable cryptographic hash committed to the smart contract, ready for decentralized authentication.",
    icon: <FiShield size={22} />,
  },
];

const METRICS = [
  { value: "< 850ms", label: "Average Verification Latency" },
  { value: "99.98%", label: "Anti-Spoofing Accuracy" },
  { value: "100%", label: "Decentralized Auditability" },
  { value: "0 bytes", label: "Raw Biometrics on Public Chain" },
];

export const UniqueFeaturesComp = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <Badge variant="verified" className="mb-3">
          Architecture Flow
        </Badge>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          How HashTrust Verifies You
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          A seamless four-stage cryptographic pipeline combining edge AI with Ethereum smart contracts.
        </p>
      </div>

      {/* 4-Step Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PIPELINE_STEPS.map((step, idx) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="glass-panel p-6 sm:p-7 rounded-3xl relative flex flex-col justify-between group hover:border-sky-500/50 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/50">
                  {step.icon}
                </div>
                <span className="text-2xl font-black font-mono text-slate-300 dark:text-slate-700 group-hover:text-sky-500 transition-colors">
                  {step.step}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>Automated Stage</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Metrics Ticker Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-16 glass-panel-elevated p-8 sm:p-10 rounded-3xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-white/10">
          {METRICS.map((metric, i) => (
            <div key={metric.label} className={i > 0 ? "pt-6 sm:pt-0" : ""}>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                {metric.value}
              </div>
              <div className="mt-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default UniqueFeaturesComp;
