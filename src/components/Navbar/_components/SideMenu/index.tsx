"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/utils/data/Navbar";
import { motion } from "framer-motion";

const SideMenu = ({ open, setOpen, hasAuth }: { open: boolean; setOpen: (v: boolean) => void; hasAuth: boolean }) => {
  const router = require("next/navigation").useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [signupDropdown, setSignupDropdown] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const signupRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (signupRef.current && !signupRef.current.contains(event.target as Node)) {
        setSignupDropdown(false);
      }
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setLoginDropdown(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);

  const filteredLinks = hasAuth
    ? NAV_LINKS.filter(l => l.label !== "Login" && l.label !== "User Sign Up" && l.label !== "Organisation Sign Up")
    : NAV_LINKS;
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("authTokenChanged"));
    setOpen(false);
    router.push("/");
  };

  return (
    <motion.div
      ref={menuRef}
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-screen w-[70vw] max-w-xs bg-white shadow-lg z-50 flex flex-col pt-6 px-6 gap-4 md:hidden"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="self-end mb-4 p-2 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
      >
        <span className="text-2xl text-blue-700">&times;</span>
      </button>
      {/* Render all links except User/Org Sign Up and Login as dropdowns */}
      {NAV_LINKS.map((link) =>
        link.label === "Sign Up" ? (
          <div
            key="SignUpDropdown"
            ref={signupRef}
            className="relative"
            onMouseEnter={() => setSignupDropdown(true)}
            onMouseLeave={() => setSignupDropdown(false)}
          >
            <button
              className="text-lg font-semibold text-blue-700 hover:text-cyan-500 transition-colors font-sans px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300 w-full text-left"
              onClick={() => setSignupDropdown((v) => !v)}
              type="button"
              onMouseEnter={() => setSignupDropdown(true)}
              onMouseLeave={e => {
                if (!e.relatedTarget || !(signupRef.current && signupRef.current.contains(e.relatedTarget as Node))) {
                  setSignupDropdown(false);
                }
              }}
            >
              Sign Up
            </button>
            {signupDropdown && (
              <div
                className="absolute left-0 top-full mt-2 bg-white border border-blue-100 rounded shadow-lg min-w-[160px] z-50"
                onMouseEnter={() => setSignupDropdown(true)}
                onMouseLeave={() => setSignupDropdown(false)}
              >
                <Link
                  href="/pages/auth/sign-up/user"
                  className="block px-4 py-2 text-blue-700 hover:bg-blue-50"
                  onClick={() => { setSignupDropdown(false); setOpen(false); }}
                >
                  User Sign Up
                </Link>
                <Link
                  href="/pages/auth/sign-up/organisation"
                  className="block px-4 py-2 text-blue-700 hover:bg-blue-50"
                  onClick={() => { setSignupDropdown(false); setOpen(false); }}
                >
                  Organisation Sign Up
                </Link>
              </div>
            )}
          </div>
        ) : link.label === "Login" ? (
          <div
            key="LoginDropdown"
            ref={loginRef}
            className="relative"
            onMouseEnter={() => setLoginDropdown(true)}
            onMouseLeave={() => setLoginDropdown(false)}
          >
            <button
              className="text-lg font-semibold text-blue-700 hover:text-cyan-500 transition-colors font-sans px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300 w-full text-left"
              onClick={() => setLoginDropdown((v) => !v)}
              type="button"
              onMouseEnter={() => setLoginDropdown(true)}
              onMouseLeave={e => {
                if (!e.relatedTarget || !(loginRef.current && loginRef.current.contains(e.relatedTarget as Node))) {
                  setLoginDropdown(false);
                }
              }}
            >
              Login
            </button>
            {loginDropdown && (
              <div
                className="absolute left-0 top-full mt-2 bg-white border border-blue-100 rounded shadow-lg min-w-[160px] z-50"
                onMouseEnter={() => setLoginDropdown(true)}
                onMouseLeave={() => setLoginDropdown(false)}
              >
                <Link
                  href="/pages/auth/login/user"
                  className="block px-4 py-2 text-blue-700 hover:bg-blue-50"
                  onClick={() => { setLoginDropdown(false); setOpen(false); }}
                >
                  User Login
                </Link>
                <Link
                  href="/pages/auth/login/organisation"
                  className="block px-4 py-2 text-blue-700 hover:bg-blue-50"
                  onClick={() => { setLoginDropdown(false); setOpen(false); }}
                >
                  Organisation Login
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link
            key={link.label}
            href={link.href}
            className="text-lg font-semibold text-blue-700 hover:text-cyan-500 transition-colors font-sans px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300"
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        )
      )}
      {hasAuth && (
        <button
          onClick={handleLogout}
          className="text-lg font-semibold text-blue-700 hover:text-red-500 transition-colors font-sans px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Logout
        </button>
      )}
    </motion.div>
  );
};

export default SideMenu;
