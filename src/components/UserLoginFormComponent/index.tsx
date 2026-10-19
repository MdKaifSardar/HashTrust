"use client";
import React, { useState } from "react";
import { loginUser } from "@/lib/actions/user.actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const UserLoginFormComponent: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

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
          window.location.href = "/pages/user/dashboard";
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
    <>
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-700 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-semibold text-base transition-colors"
        >
          <span className="text-xl">&#8592;</span> Back to Home
        </Link>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-[90%] sm:w-[50%] lg:w-[40%] xl:w-[30%] mx-auto bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-8 border border-blue-100 dark:border-slate-800 backdrop-blur-md mt-12 sm:mt-0 transition-colors"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400">
          User Login
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              className="text-blue-700 dark:text-slate-200 font-semibold text-sm transition-colors"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="border border-blue-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 dark:focus:ring-cyan-500/50 focus:outline-none bg-blue-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-blue-700 dark:text-slate-200 font-semibold text-sm transition-colors"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="border border-blue-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 dark:focus:ring-cyan-500/50 focus:outline-none bg-blue-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 text-white font-semibold rounded-lg px-4 py-3 mt-2 shadow hover:scale-[1.02] hover:shadow-xl transition-all duration-200 cursor-pointer"
          disabled={submitting}
        >
          {submitting ? "Logging In..." : "Login"}
        </button>
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-slate-400 transition-colors">
          Don&apos;t have an account?{" "}
          <Link
            href="/pages/auth/sign-up/user"
            className="text-blue-600 dark:text-cyan-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </form>
    </>
  );
};

export default UserLoginFormComponent;
