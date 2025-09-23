"use client";
import React, { useState } from "react";
import { loginUser } from "@/lib/actions/user.actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        document.cookie = `session=${res.sessionCookie}; path=/; max-age=${60 * 60 * 24 * 5}; SameSite=Strict; Secure`;
        toast.success(res.message || "Login successful!");
        setTimeout(() => {
          router.push("/pages/user/dashboard");
        }, 1200);
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
          className="flex items-center gap-2 text-blue-700 hover:text-cyan-500 font-semibold text-base"
        >
          <span className="text-xl">&#8592;</span> Back to Home
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto bg-white/90 rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-8 border border-blue-100 backdrop-blur-md mt-16"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400">
          User Login
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              className="text-blue-700 font-semibold text-sm"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-blue-700 font-semibold text-sm"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 text-white font-semibold rounded-lg px-4 py-3 mt-2 shadow hover:scale-[1.02] hover:shadow-xl transition-all duration-200"
          disabled={submitting}
        >
          {submitting ? "Logging In..." : "Login"}
        </button>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a
            href="/pages/auth/signup"
            className="text-blue-600 hover:underline"
          >
            Sign up
          </a>
        </div>
      </form>
    </>
  );
};

export default UserLoginFormComponent;
