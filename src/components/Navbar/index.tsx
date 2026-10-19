"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRoleFromSessionCookie } from "@/lib/actions/user.actions";
import ThemeToggle from "@/components/ThemeToggle";
import { FiChevronDown, FiShield, FiUser, FiBriefcase, FiLogOut, FiGrid } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function hasSessionCookie() {
  return (
    typeof document !== "undefined" &&
    document.cookie
      .split(";")
      .map((row) => row.trim())
      .some((row) => row.startsWith("session="))
  );
}

export const Navbar = ({
  onLogoutClick,
  onSideMenuToggle,
}: {
  onLogoutClick?: () => void;
  onSideMenuToggle?: () => void;
}) => {
  const [hasAuth, setHasAuth] = useState(false);
  const [signupDropdown, setSignupDropdown] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const signupRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const signupTimeout = useRef<NodeJS.Timeout | null>(null);
  const loginTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let lastSession = hasSessionCookie();
    setHasAuth(lastSession);
    const interval = setInterval(() => {
      const currentSession = hasSessionCookie();
      if (currentSession !== lastSession) {
        setHasAuth(currentSession);
        lastSession = currentSession;
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (signupRef.current && !signupRef.current.contains(e.target as Node)) {
        setSignupDropdown(false);
      }
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
        if (res.role === "user") {
          router.push("/pages/user/dashboard");
        } else if (res.role === "organisation") {
          router.push("/pages/organisation/dashboard");
        } else {
          if (typeof window !== "undefined") {
            const { toast } = await import("react-toastify");
            toast.error("Unknown role. Cannot redirect to dashboard.");
          }
        }
      } else {
        if (typeof window !== "undefined") {
          const { toast } = await import("react-toastify");
          toast.error(res.message || "Unable to determine role. Please log in.");
        }
      }
    } catch (err: any) {
      if (typeof window !== "undefined") {
        const { toast } = await import("react-toastify");
        toast.error(err?.message || "Unable to determine role. Please log in.");
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-emerald-400 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <FiShield className="text-sky-600 dark:text-sky-400 text-lg" />
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hash<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-400">Trust</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/#services"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Services
          </Link>
          <Link
            href="/#features"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pages/demo"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Similarity Demo
          </Link>
          <Link
            href="/pages/demo-face-liveness"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Liveness Demo
          </Link>
        </div>

        {/* Right Section: Auth & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {!hasAuth ? (
            <>
              {/* Login Dropdown */}
              <div
                ref={loginRef}
                className="relative"
                onMouseEnter={() => {
                  if (loginTimeout.current) clearTimeout(loginTimeout.current);
                  setLoginDropdown(true);
                }}
                onMouseLeave={() => {
                  loginTimeout.current = setTimeout(() => setLoginDropdown(false), 150);
                }}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <span>Sign In</span>
                  <FiChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${loginDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {loginDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 w-60 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-900/10 dark:shadow-black/50 z-50"
                    >
                      <Link
                        href="/pages/auth/login/user"
                        onClick={() => setLoginDropdown(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                          <FiUser size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Personal User
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            View your verified identity
                          </p>
                        </div>
                      </Link>
                      <Link
                        href="/pages/auth/login/organisation"
                        onClick={() => setLoginDropdown(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          <FiBriefcase size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Organisation
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Manage API keys & verification
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sign Up Dropdown */}
              <div
                ref={signupRef}
                className="relative"
                onMouseEnter={() => {
                  if (signupTimeout.current) clearTimeout(signupTimeout.current);
                  setSignupDropdown(true);
                }}
                onMouseLeave={() => {
                  signupTimeout.current = setTimeout(() => setSignupDropdown(false), 150);
                }}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 rounded-xl shadow-md shadow-sky-600/20 dark:shadow-sky-500/20 transition-all duration-150 cursor-pointer"
                >
                  <span>Get Started</span>
                  <FiChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${signupDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {signupDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 w-64 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-900/10 dark:shadow-black/50 z-50"
                    >
                      <Link
                        href="/pages/auth/sign-up/user"
                        onClick={() => setSignupDropdown(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                          <FiUser size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Create User Identity
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Instant biometric onboarding
                          </p>
                        </div>
                      </Link>
                      <Link
                        href="/pages/auth/sign-up/organisation"
                        onClick={() => setSignupDropdown(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          <FiBriefcase size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Register Organisation
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Integrate fraud-proof verification
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDashboardClick}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 rounded-xl shadow-md shadow-sky-600/20 transition-all duration-150 cursor-pointer"
              >
                <FiGrid size={15} />
                <span>Dashboard</span>
              </button>
              <button
                type="button"
                onClick={onLogoutClick}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <FiLogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Controls (ThemeToggle + Hamburger) */}
        <div className="md:hidden flex items-center gap-2.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={onSideMenuToggle}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span className="block h-0.5 w-full bg-current rounded-full" />
              <span className="block h-0.5 w-full bg-current rounded-full" />
              <span className="block h-0.5 w-full bg-current rounded-full" />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
