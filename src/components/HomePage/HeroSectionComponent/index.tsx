"use client";

import React from "react";
import { motion } from "framer-motion";

const HeroSectionComponent = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-20">
      {/* Headline and CTA */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-5xl md:text-7xl font-extrabold text-blue-700 text-center mb-6 tracking-tight drop-shadow-lg leading-tight"
      >
        Empower Your Identity
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 animate-gradient-x">
          On the Blockchain
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-xl md:text-2xl text-gray-700 text-center max-w-2xl mb-10"
      >
        Next-generation onboarding: fast, secure, and privacy-first. Your digital
        identity, verified and anchored for life.
      </motion.p>
      <motion.a
        href="/pages/auth/sign-up/user"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 text-white font-semibold text-xl shadow-lg hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-200 border-0 mb-12"
        whileHover={{
          scale: 1.12,
          boxShadow: "0 12px 40px 0 rgba(0, 123, 255, 0.18)",
        }}
        whileTap={{ scale: 0.97 }}
      >
        Get Started
      </motion.a>
      {/* Feature Highlights */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 8px 32px 0 rgba(34,197,246,0.18)",
          }}
          className="bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-100 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-0 hover:shadow-2xl transition-all duration-200 cursor-pointer"
        >
          <span className="text-4xl mb-2">🔒</span>
          <span className="font-semibold text-blue-700 mb-1 text-lg">
            Privacy First
          </span>
          <span className="text-gray-600 text-sm">
            Your data is hashed and anchored, never exposed.
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 8px 32px 0 rgba(34,197,246,0.18)",
          }}
          className="bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-100 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-0 hover:shadow-2xl transition-all duration-200 cursor-pointer"
        >
          <span className="text-4xl mb-2">⚡</span>
          <span className="font-semibold text-blue-700 mb-1 text-lg">
            Instant Verification
          </span>
          <span className="text-gray-600 text-sm">
            AI-powered checks for real-time onboarding.
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 8px 32px 0 rgba(34,197,246,0.18)",
          }}
          className="bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-100 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-0 hover:shadow-2xl transition-all duration-200 cursor-pointer"
        >
          <span className="text-4xl mb-2">⛓️</span>
          <span className="font-semibold text-blue-700 mb-1 text-lg">
            Blockchain Anchored
          </span>
          <span className="text-gray-600 text-sm">
            Immutable, auditable, and tamper-proof records.
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 8px 32px 0 rgba(34,197,246,0.18)",
          }}
          className="bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-100 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-0 hover:shadow-2xl transition-all duration-200 cursor-pointer"
        >
          <span className="text-4xl mb-2">🤖</span>
          <span className="font-semibold text-blue-700 mb-1 text-lg">
            AI-Driven
          </span>
          <span className="text-gray-600 text-sm">
            Smart extraction and matching for accuracy.
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSectionComponent;
