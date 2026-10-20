"use client";

import React, { useState } from "react";
import { loginUser } from "@/lib/actions/user.actions";
import { toast } from "react-toastify";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { FiMail, FiLock, FiArrowLeft, FiShield } from "react-icons/fi";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";

export const UserLoginFormComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  const targetRedirect =
    rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/pages/user/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await loginUser(form.email, form.password);
      if (res.ok && res.sessionCookie) {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        document.cookie = `session=${res.sessionCookie}; path=/; max-age=${
          60 * 60 * 24 * 5
        }; SameSite=Lax${isSecure ? "; Secure" : ""}`;
        toast.success(res.message || "Login successful!");
        setTimeout(() => {
          window.location.href = targetRedirect;
        }, 1000);
      } else {
        toast.error(res.message || "Login failed.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-auth-gradient">

      {/* Top Controls */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors shadow-sm"
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-400 p-0.5 shadow-md shadow-sky-500/20 mb-4">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <FiShield className="text-sky-600 dark:text-sky-400 text-xl" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Personal Sign In
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Access your verified decentralized identity
          </p>

          {/* Role Switcher Pill */}
          <div className="mt-5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex w-full">
            <span className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm text-center">
              Personal User
            </span>
            <Link
              href="/pages/auth/login/organisation"
              className="flex-1 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-center transition-colors"
            >
              Organisation
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            leftIcon={<FiMail size={16} />}
            required
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            leftIcon={<FiLock size={16} />}
            required
          />

          <div className="mt-2">
            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={submitting}
            >
              Sign In to Dashboard
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an identity yet?{" "}
          <Link
            href="/pages/auth/sign-up/user"
            className="font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Create your Identity
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLoginFormComponent;
