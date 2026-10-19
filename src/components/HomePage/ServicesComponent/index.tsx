"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiShield, FiLink, FiLock, FiZap, FiCheckCircle } from "react-icons/fi";
import Badge from "@/components/ui/Badge";

export const ServicesComponent = () => {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-14">
        <Badge variant="live" className="mb-3">
          Core Infrastructure
        </Badge>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Architected for Maximum Trust
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Everything your platform needs to onboard legitimate users and eliminate spoofing, deepfakes, and identity tampering.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Large Featured Card (2 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between group hover:border-sky-500/50 transition-colors"
        >
          <div className="relative z-10 max-w-lg">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 border border-sky-500/20">
              <FiShield size={24} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Passive Face Liveness & Anti-Spoofing
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Our neural network validates genuine human presence in milliseconds without intrusive gestures or blinking challenges. Detects silicone masks, screen playbacks, and printed photos effortlessly.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1.5">
                <FiCheckCircle className="text-emerald-500" />
                Zero Gesture Interruption
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1.5">
                <FiCheckCircle className="text-emerald-500" />
                Deepfake & Replay Defense
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1.5">
                <FiCheckCircle className="text-emerald-500" />
                ISO/IEC 30107-3 Standard
              </span>
            </div>
          </div>
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        </motion.div>

        {/* Card 2: Blockchain Anchors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel p-8 rounded-3xl flex flex-col justify-between group hover:border-emerald-500/50 transition-colors"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20">
              <FiLink size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Blockchain Anchoring
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Verified identity credentials produce an immutable Keccak-256 state hash committed directly to Ethereum smart contracts, enabling instant decentralized verification.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate">
            Proof: 0x4f12...e8a2
          </div>
        </motion.div>

        {/* Card 3: Zero-Knowledge Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-8 rounded-3xl flex flex-col justify-between group hover:border-indigo-500/50 transition-colors"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/20">
              <FiLock size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Privacy by Design
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No unencrypted biometric data or sensitive identity documents ever touch public blockchains. Only cryptographic integrity hashes are retained.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Client-side encryption verified</span>
          </div>
        </motion.div>

        {/* Card 4: Lightning Speed API (2 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-2 glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between group hover:border-sky-500/50 transition-colors"
        >
          <div className="relative z-10 max-w-lg">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 border border-sky-500/20">
              <FiZap size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Sub-Second Enterprise REST API
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Integrate fraud-proof verification into existing web and mobile apps with 3 lines of code. Issue organization API keys, set webhook listeners, and track verification metrics in real-time.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
              <span className="text-cyan-400">POST</span> /api/v1/login/user <span className="text-slate-500">{"{ apiKey: 'sk_live_...' }"}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesComponent;
