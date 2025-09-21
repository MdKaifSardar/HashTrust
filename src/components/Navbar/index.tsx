"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/utils/data/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import SideMenu from "@/components/Navbar/_components/SideMenu";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";

// Helper to check for session cookie
function hasSessionCookie() {
  return document.cookie.split("; ").some((row) => row.startsWith("session="));
}

// Helper to remove session cookie
function removeSessionCookie() {
  document.cookie = "session=; path=/; max-age=0; SameSite=Strict; Secure";
  window.dispatchEvent(new Event("sessionChanged"));
}

const Navbar = ({ onLogoutClick }: { onLogoutClick?: () => void }) => {
  const [open, setOpen] = useState(false);
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

  const filteredLinks = hasAuth
    ? NAV_LINKS.filter((l) => l.label !== "Login" && l.label !== "Sign Up")
    : NAV_LINKS;

  const handleLogout = () => {
    if (onLogoutClick) onLogoutClick();
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <nav className="z-[100] fixed top-0 left-0 w-full bg-white/80 backdrop-blur border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="text-2xl font-extrabold text-blue-700 tracking-tight font-sans"
          >
            BlockID
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
                    className="text-base font-semibold text-blue-700 hover:text-cyan-500 transition-colors font-sans px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    type="button"
                  >
                    Sign Up
                  </button>
                  {signupDropdown && (
                    <div className="absolute left-0 top-full mt-2 bg-white border border-blue-100 rounded shadow-lg min-w-[160px] z-50">
                      <Link
                        href="/pages/auth/sign-up/user"
                        className="block px-4 py-2 text-blue-700 hover:bg-blue-50"
                        onClick={() => setSignupDropdown(false)}
                      >
                        User Sign Up
                      </Link>
                      <Link
                        href="/pages/auth/sign-up/organisation"
                        className="block px-4 py-2 text-blue-700 hover:bg-blue-50"
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
                    className="text-base font-semibold text-blue-700 hover:text-cyan-500 transition-colors font-sans px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    type="button"
                  >
                    Login
                  </button>
                  {loginDropdown && (
                    <div className="absolute left-0 top-full mt-2 bg-white border border-blue-100 rounded shadow-lg min-w-[160px] z-50">
                      <Link
                        href="/pages/auth/login/user"
                        className="block px-4 py-2 text-blue-700 hover:bg-blue-50"
                        onClick={() => setLoginDropdown(false)}
                      >
                        User Login
                      </Link>
                      <Link
                        href="/pages/auth/login/organisation"
                        className="block px-4 py-2 text-blue-700 hover:bg-blue-50"
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
                    className="text-base font-semibold text-blue-700 hover:text-cyan-500 transition-colors font-sans px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  >
                    {link.label}
                  </Link>
                )
              )
            )}
            {hasAuth && (
              <button
                onClick={handleLogout}
                className="text-base font-semibold text-blue-700 hover:text-red-500 transition-colors font-sans px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Logout
              </button>
            )}
          </div>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`block h-0.5 w-6 bg-blue-700 rounded transition-all duration-200 ${
                open ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-blue-700 rounded transition-all duration-200 ${
                open ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-blue-700 rounded transition-all duration-200 ${
                open ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <>
              {/* Overlay for mobile menu */}
              <motion.div
                className="fixed inset-0 bg-black/30 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              {/* Mobile Menu */}
              <SideMenu open={open} setOpen={setOpen} hasAuth={hasAuth} />
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
