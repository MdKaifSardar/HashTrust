"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRoleFromSessionCookie } from "@/lib/actions/user.actions";
import { FiX, FiShield, FiUser, FiBriefcase, FiLogOut, FiGrid, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

export const SideMenu = ({
  open,
  setOpen,
  hasAuth,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  hasAuth: boolean;
}) => {
  const router = useRouter();

  const handleDashboardClick = async () => {
    try {
      const sessionCookie = document.cookie
        .split(";")
        .map((row) => row.trim())
        .find((row) => row.startsWith("session="))
        ?.slice("session=".length);

      if (!sessionCookie) {
        if (typeof window !== "undefined") {
          const { toast } = await import("react-toastify");
          toast.error("You are not signed in. Please log in first.");
        }
        return;
      }

      const res = await getRoleFromSessionCookie(sessionCookie);
      if (res.ok && res.role) {
        setOpen(false);
        if (res.role === "user") {
          router.push("/pages/user/dashboard");
        } else if (res.role === "organisation") {
          router.push("/pages/organisation/dashboard");
        }
      }
    } catch {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    window.dispatchEvent(new Event("showLogoutModal"));
    setOpen(false);
  };

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      onClick={(e) => e.stopPropagation()}
      className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/10 shadow-2xl z-[1001] flex flex-col p-6 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-600 dark:bg-sky-500 flex items-center justify-center text-white dark:text-slate-950">
            <FiShield size={18} />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">HashTrust</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          aria-label="Close menu"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex flex-col gap-2 py-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-colors"
        >
          <span>Home</span>
          <FiArrowRight size={16} className="text-slate-400" />
        </Link>
        <Link
          href="/#services"
          onClick={() => setOpen(false)}
          className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-colors"
        >
          <span>Services</span>
          <FiArrowRight size={16} className="text-slate-400" />
        </Link>
        <Link
          href="/#features"
          onClick={() => setOpen(false)}
          className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-colors"
        >
          <span>Features</span>
          <FiArrowRight size={16} className="text-slate-400" />
        </Link>
        <Link
          href="/pages/demo"
          onClick={() => setOpen(false)}
          className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-colors"
        >
          <span>Face Similarity Demo</span>
          <FiArrowRight size={16} className="text-slate-400" />
        </Link>
        <Link
          href="/pages/demo-face-liveness"
          onClick={() => setOpen(false)}
          className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-colors"
        >
          <span>Silent Liveness Demo</span>
          <FiArrowRight size={16} className="text-slate-400" />
        </Link>
      </nav>

      {/* Auth Actions Section */}
      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col gap-3">
        {hasAuth ? (
          <>
            <button
              type="button"
              onClick={handleDashboardClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md shadow-sky-600/20"
            >
              <FiGrid size={18} />
              <span>Go to Dashboard</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium transition-colors"
            >
              <FiLogOut size={18} />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Personal Identity
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/pages/auth/login/user"
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-3 rounded-xl text-center text-xs font-semibold border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  User Login
                </Link>
                <Link
                  href="/pages/auth/sign-up/user"
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-3 rounded-xl text-center text-xs font-semibold bg-sky-600 text-white shadow-sm hover:bg-sky-500 transition-colors"
                >
                  User Sign Up
                </Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                For Organisations
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/pages/auth/login/organisation"
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-3 rounded-xl text-center text-xs font-semibold border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Org Login
                </Link>
                <Link
                  href="/pages/auth/sign-up/organisation"
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-3 rounded-xl text-center text-xs font-semibold bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 transition-colors"
                >
                  Org Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default SideMenu;
