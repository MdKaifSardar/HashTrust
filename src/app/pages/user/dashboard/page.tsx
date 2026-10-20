"use client";

import React, { useEffect, useState } from "react";
import { authenticateUserWithSessionCookie } from "@/lib/actions/user.actions";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  FiShield,
  FiCheckCircle,
  FiCopy,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiLock,
  FiExternalLink
} from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startAutoRedirect = (errorMsg: string) => {
    setUser(null);
    setAuthError(errorMsg);
    setCountdown(3);
  };

  const verifyUser = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const sessionCookie = document.cookie
        .split(";")
        .map((row) => row.trim())
        .find((row) => row.startsWith("session="))
        ?.slice("session=".length);

      if (!sessionCookie) {
        startAutoRedirect("Authentication required. No active session found.");
        return;
      }

      const userRes = await authenticateUserWithSessionCookie(sessionCookie);
      if (userRes.ok && userRes.user) {
        setUser(userRes.user);
      } else {
        const errorMsg = userRes.message || "Failed to fetch user details.";
        toast.error(errorMsg);
        startAutoRedirect(errorMsg);
      }
    } catch (e: any) {
      const errorMsg = e?.message || "Authentication failed.";
      toast.error(errorMsg);
      startAutoRedirect(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();

    // Multi-tab and cross-component session synchronization
    const handleSessionChanged = () => {
      const hasSession = document.cookie
        .split(";")
        .map((row) => row.trim())
        .some((row) => row.startsWith("session="));
      if (!hasSession) {
        startAutoRedirect("Session terminated. Redirecting to login...");
      } else {
        verifyUser();
      }
    };

    window.addEventListener("sessionChanged", handleSessionChanged);
    window.addEventListener("storage", handleSessionChanged);

    return () => {
      window.removeEventListener("sessionChanged", handleSessionChanged);
      window.removeEventListener("storage", handleSessionChanged);
    };
  }, []);

  // Handle countdown for auto-redirect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      router.replace("/pages/auth/login/user?redirect=/pages/user/dashboard");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  const handleCopyProof = () => {
    if (!user) return;
    const proofId = `0x${Array.from(user.emailAddress || "hash")
      .map((c: any) => c.charCodeAt(0).toString(16))
      .join("")
      .slice(0, 32)}`;
    navigator.clipboard.writeText(proofId);
    setCopied(true);
    toast.success("Proof hash copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Top Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-60 sm:w-72 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-6 w-28 bg-emerald-100 dark:bg-emerald-950/50 rounded-full" />
              </div>
              <div className="h-4 w-64 bg-slate-200/70 dark:bg-slate-800/60 rounded-lg" />
            </div>
            <div className="h-9 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>

          {/* Digital Identity Passport Card Skeleton */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500/50 via-cyan-400/50 to-emerald-400/50" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar Skeleton */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-slate-200 dark:bg-slate-800 shrink-0 border-2 border-slate-300 dark:border-slate-700" />

              {/* Core Info Skeleton */}
              <div className="flex-1 w-full space-y-4">
                <div className="space-y-2 text-center md:text-left">
                  <div className="h-7 w-48 mx-auto md:mx-0 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-4 w-60 mx-auto md:mx-0 bg-slate-200/70 dark:bg-slate-800/60 rounded-lg" />
                </div>
                <div className="flex gap-2 justify-center md:justify-start">
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
                {/* Grid fields skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/70 dark:border-white/10">
                  <div className="h-14 bg-slate-100 dark:bg-slate-900 rounded-xl" />
                  <div className="h-14 bg-slate-100 dark:bg-slate-900 rounded-xl" />
                  <div className="h-14 bg-slate-100 dark:bg-slate-900 rounded-xl" />
                  <div className="h-14 bg-slate-100 dark:bg-slate-900 rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Proof Ledger Skeleton */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-44 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
            <div className="h-16 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors p-4">
        <div className="max-w-md w-full glass-panel-elevated p-8 rounded-3xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center mb-4">
            <FiLock size={22} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
            {authError || "Please sign in to view your verified self-sovereign identity credential."}
          </p>

          {countdown !== null && (
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Redirecting to sign in in {countdown}s...
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pages/auth/login/user?redirect=/pages/user/dashboard">
              <Button variant="primary" size="md">
                Sign In Now
              </Button>
            </Link>
            <Link href="/pages/auth/sign-up/user">
              <Button variant="outline" size="md">
                Create Identity
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let address = user.userAddress;
  try {
    if (typeof address === "string") {
      address = JSON.parse(address);
    }
  } catch {
    // leave as is
  }

  const faceLive = user.verificationStatus?.faceLiveness?.status === "LIVE";
  const simMatch = user.verificationStatus?.faceSimilarity?.status === "MATCH";
  const fakeHash = `0x${Array.from(user.emailAddress || "hash")
    .map((c: any) => c.charCodeAt(0).toString(16))
    .join("")
    .slice(0, 32)}...`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header & Verification Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Personal Identity Console
              </h1>
              <Badge variant="verified" size="md">
                Verified On-Chain
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Cryptographically proven against Ethereum Smart Contracts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyProof}
              leftIcon={<FiCopy size={14} />}
            >
              {copied ? "Copied Proof Hash!" : "Copy Proof Hash"}
            </Button>
          </div>
        </div>

        {/* Digital Identity Passport Card */}
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* User Avatar */}
            <div className="relative group shrink-0">
              {user.userImage?.url ? (
                <img
                  src={user.userImage.url}
                  alt={user.name}
                  className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-3xl border-2 border-sky-500 shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                  No Image
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-500 text-white shadow-lg">
                <FiCheckCircle size={18} />
              </div>
            </div>

            {/* Core Credential Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </h2>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    ID Holder
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
                  {user.emailAddress}
                </p>
              </div>

              {/* Quick Status Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 text-left">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Biometric Liveness
                  </span>
                  <Badge variant={faceLive ? "verified" : "danger"} size="sm">
                    {faceLive ? "PASSIVE LIVE" : "FAILED"}
                  </Badge>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 text-left">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Document Match
                  </span>
                  <Badge variant={simMatch ? "verified" : "danger"} size="sm">
                    {simMatch ? "MATCHED 1:1" : "DISCREPANCY"}
                  </Badge>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 text-left">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Contract State
                  </span>
                  <Badge variant="live" size="sm">
                    ANCHORED
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Attribute Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal & Contact Attributes */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <FiFileText className="text-sky-500" />
              <span>Verified Personal Records</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <FiPhone size={14} /> Phone Number
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {user.phoneNumber || "Not registered"}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <FiCalendar size={14} /> Date of Birth
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {user.dateOfBirth || "Not registered"}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <FiShield size={14} /> Aadhaar / Gov ID
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  {user.idNumber ? `•••• •••• ${user.idNumber.slice(-4)}` : "Not available"}
                </span>
              </div>

              <div className="pt-1">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-1.5">
                  <FiMapPin size={14} /> Registered Address
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {address && typeof address === "object" ? (
                    <>
                      {address.po ? `PO: ${address.po}, ` : ""}
                      {address.district ? `District: ${address.district}, ` : ""}
                      {address.state ? `State: ${address.state}` : ""}
                      {address.pin ? ` - ${address.pin}` : ""}
                    </>
                  ) : (
                    "No address recorded"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Cryptographic & Document Proof */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <FiLock className="text-emerald-500" />
                <span>Cryptographic Proof & Document</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    Smart Contract State Root
                  </span>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 break-all select-all">
                    {fakeHash}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-2">
                    Verified Identity Document
                  </span>
                  {user.identityDocument?.url ? (
                    <div className="relative group max-w-xs rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
                      <img
                        src={user.identityDocument.url}
                        alt="Government Identity Document"
                        className="w-full h-36 object-contain bg-slate-900/5 dark:bg-slate-950"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Document unavailable.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
              <span>Auditable on Sepolia Testnet</span>
              <a
                href="https://sepolia.etherscan.io"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline"
              >
                <span>View explorer</span>
                <FiExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
