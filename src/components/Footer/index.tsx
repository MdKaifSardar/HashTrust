"use client";

import React from "react";
import Link from "next/link";
import { FiShield, FiExternalLink } from "react-icons/fi";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-200/80 dark:border-white/10">
          {/* Brand & Tagline */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-emerald-400 p-0.5 shadow-md shadow-sky-500/20">
                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <FiShield className="text-sky-600 dark:text-sky-400 text-sm" />
                </div>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Hash<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-400">Trust</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Decentralized biometric identity anchoring and anti-spoofing verification powered by Ethereum smart contracts.
            </p>
            {/* Live Network Health Status Badge */}
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[11px]">Sepolia Testnet: Live</span>
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span className="font-mono text-[11px]">Passive Liveness AI: Operational</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/#services" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Identity Verification
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Blockchain Proof Anchors
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer / Enterprise */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Developers & Business
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/pages/auth/login/organisation" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  API Key Management
                </Link>
              </li>
              <li>
                <Link href="/pages/auth/sign-up/organisation" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Organisation Onboarding
                </Link>
              </li>
              <li>
                <a
                  href="https://sepolia.etherscan.io"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  <span>Smart Contracts</span>
                  <FiExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Trust & Privacy
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li className="text-xs text-slate-500 dark:text-slate-400">
                Zero raw biometric data stored on public ledgers. Cryptographic hash proofs only.
              </li>
              <li className="text-xs text-slate-500 dark:text-slate-400">
                Self-sovereign cryptographic ownership governed by user session keys.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} HashTrust. Built for decentralized trust & fraud prevention.</p>
          <div className="flex items-center gap-6">
            <span>Privacy-First</span>
            <span>•</span>
            <span>Zero-Knowledge Proofs</span>
            <span>•</span>
            <span>Enterprise Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;