"use client";

import React, { useState } from "react";
import { loginOrganisation } from "@/lib/actions/org.actions";
import { toast } from "react-toastify";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { FiMail, FiLock, FiArrowLeft, FiBriefcase } from "react-icons/fi";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export const OrgLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginOrganisation({ email, password });
      if (res.ok && res.sessionCookie) {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        document.cookie = `session=${res.sessionCookie}; path=/; max-age=${60 * 60 * 24 * 5}; SameSite=Lax${isSecure ? "; Secure" : ""}`;
        toast.success(res.message);
        setTimeout(() => {
          window.location.href = "/pages/organisation/dashboard";
        }, 1000);
      } else {
        toast.error(res.message || "Login failed.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-auth-gradient">

      {/* Top Controls */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm"
        >
          <FiArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md glass-panel-elevated p-8 sm:p-10 rounded-3xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-sky-400 p-0.5 shadow-md shadow-emerald-500/20 mb-4">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <FiBriefcase className="text-emerald-600 dark:text-emerald-400 text-xl" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Organisation Sign In
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your API keys & verification pipelines
          </p>

          {/* Role Switcher Pill */}
          <div className="mt-5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex w-full">
            <Link
              href="/pages/auth/login/user"
              className="flex-1 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-center transition-colors"
            >
              Personal User
            </Link>
            <span className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm text-center">
              Organisation
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Organisation Email"
            id="email"
            type="email"
            placeholder="admin@enterprise.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<FiMail size={16} />}
            required
          />

          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<FiLock size={16} />}
            required
          />

          <div className="mt-2">
            <Button
              type="submit"
              variant="success"
              size="lg"
              fullWidth
              isLoading={loading}
            >
              Sign In to Console
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
          Need an organisation account?{" "}
          <Link
            href="/pages/auth/sign-up/organisation"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Register Organisation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrgLoginForm;
