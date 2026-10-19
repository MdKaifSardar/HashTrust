"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/utils/data/Navbar";
import { useRouter } from "next/navigation";
import { getRoleFromSessionCookie } from "@/lib/actions/user.actions";
import ThemeToggle from "@/components/ThemeToggle";

// Helper to check for session cookie
function hasSessionCookie() {
  return (
    typeof document !== "undefined" &&
    document.cookie
      .split(";")
      .map((row) => row.trim())
      .some((row) => row.startsWith("session="))
  );
}

const Navbar = ({ onLogoutClick, onSideMenuToggle }: { onLogoutClick?: () => void; onSideMenuToggle?: () => void }) => {
  const [hasAuth, setHasAuth] = useState(false);
  const [signupDropdown, setSignupDropdown] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const signupRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const signupTimeout = useRef<NodeJS.Timeout | null>(null);
  const loginTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Poll for session cookie changes every 500ms
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

  // Close dropdowns on outside click
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

  // Dashboard link handler for desktop
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

  const filteredLinks = hasAuth
    ? NAV_LINKS.filter((l) => l.label !== "Login" && l.label !== "Sign Up")
    : NAV_LINKS.filter((l) => l.label !== "Dashboard" && l.label !== "Login" && l.label !== "Sign Up");

  const handleLogout = () => {
    if (onLogoutClick) onLogoutClick();
  };

  return (
    <>
      <nav className="z-[100] fixed top-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-blue-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="text-2xl font-extrabold text-blue-700 dark:text-cyan-400 tracking-tight font-sans transition-colors"
          >
            HashTrust
          </Link>
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4 md:gap-8 items-center">
            {NAV_LINKS.map((link) =>
              !hasAuth && link.label === "Sign Up" ? (
                <div
                  key="SignUpDropdown"
                  ref={signupRef}
                  className="relative"
                  onMouseEnter={() => {
                    if (signupTimeout.current)
                      clearTimeout(signupTimeout.current);
                    setSignupDropdown(true);
                  }}
                  onMouseLeave={() => {
                    signupTimeout.current = setTimeout(
                      () => setSignupDropdown(false),
                      120
                    );
                  }}
                >
                  <button
                    className="text-base font-semibold text-blue-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors font-sans px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:focus:ring-cyan-500/50"
                    type="button"
                  >
                    Sign Up
                  </button>
                  {signupDropdown && (
                    <div className="absolute left-0 top-full mt-2 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-lg shadow-lg dark:shadow-slate-950/60 min-w-[170px] z-50 py-1 transition-colors">
                      <Link
                        href="/pages/auth/sign-up/user"
                        className="block px-4 py-2 text-blue-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors"
                        onClick={() => setSignupDropdown(false)}
                      >
                        User Sign Up
                      </Link>
                      <Link
                        href="/pages/auth/sign-up/organisation"
                        className="block px-4 py-2 text-blue-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors"
                        onClick={() => setSignupDropdown(false)}
                      >
                        Organisation Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              ) : !hasAuth && link.label === "Login" ? (
                <div
                  key="LoginDropdown"
                  ref={loginRef}
                  className="relative"
                  onMouseEnter={() => {
                    if (loginTimeout.current)
                      clearTimeout(loginTimeout.current);
                    setLoginDropdown(true);
                  }}
                  onMouseLeave={() => {
                    loginTimeout.current = setTimeout(
                      () => setLoginDropdown(false),
                      120
                    );
                  }}
                >
                  <button
                    className="text-base font-semibold text-blue-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors font-sans px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:focus:ring-cyan-500/50"
                    type="button"
                  >
                    Login
                  </button>
                  {loginDropdown && (
                    <div className="absolute left-0 top-full mt-2 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-lg shadow-lg dark:shadow-slate-950/60 min-w-[170px] z-50 py-1 transition-colors">
                      <Link
                        href="/pages/auth/login/user"
                        className="block px-4 py-2 text-blue-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors"
                        onClick={() => setLoginDropdown(false)}
                      >
                        User Login
                      </Link>
                      <Link
                        href="/pages/auth/login/organisation"
                        className="block px-4 py-2 text-blue-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors"
                        onClick={() => setLoginDropdown(false)}
                      >
                        Organisation Login
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                link.label !== "Sign Up" &&
                link.label !== "Login" && (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-base font-semibold text-blue-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors font-sans px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:focus:ring-cyan-500/50"
                  >
                    {link.label}
                  </Link>
                )
              )
            )}
            {hasAuth && (
              <button
                type="button"
                className="text-base font-semibold text-blue-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors font-sans px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:focus:ring-cyan-500/50"
                onClick={handleDashboardClick}
              >
                Dashboard
              </button>
            )}
            {hasAuth && (
              <button
                onClick={handleLogout}
                className="text-base font-semibold text-blue-700 dark:text-slate-200 hover:text-red-500 dark:hover:text-red-400 transition-colors font-sans px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-500/50"
              >
                Logout
              </button>
            )}

            {/* Desktop Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Right Controls: ThemeToggle + Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="flex flex-col gap-1.5 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:focus:ring-cyan-500/50"
              aria-label="Open menu"
              onClick={() => {
                if (onSideMenuToggle) onSideMenuToggle();
              }}
            >
              <span
                className="block h-0.5 w-6 bg-blue-700 dark:bg-slate-200 rounded transition-all duration-200"
              ></span>
              <span
                className="block h-0.5 w-6 bg-blue-700 dark:bg-slate-200 rounded transition-all duration-200"
              ></span>
              <span
                className="block h-0.5 w-6 bg-blue-700 dark:bg-slate-200 rounded transition-all duration-200"
              ></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
