"use client";
import React, { useState } from "react";
import { loginOrganisation } from "@/lib/actions/org.actions";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const OrgLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await loginOrganisation({ email, password });
    setLoading(false);
    if (res.ok && res.sessionCookie) {
      // Save session cookie to browser
      document.cookie = `session=${res.sessionCookie}; path=/; max-age=${60 * 60 * 24 * 5}; SameSite=Strict; Secure`;
      toast.success(res.message);
      setTimeout(() => {
          router.push("/pages/organisation/dashboard");
        }, 1200);
    } else if (res.ok) {
      // If sessionCookie is not returned, just proceed
      toast.success(res.message);
      setTimeout(() => {
          router.push("/pages/organisation/dashboard");
        }, 1200);
    } else {
      toast.error(res.message);
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
        className="w-[90%] sm:w-[50%] lg:w-[40%] xl:w-[30%] mx-auto bg-white/90 rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-8 border border-blue-100 backdrop-blur-md
          mt-12 sm:mt-0"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400">
          Organisation Login
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-blue-700 font-semibold text-sm" htmlFor="email">
              Organisation Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Organisation Email"
              className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-blue-700 font-semibold text-sm" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 text-white font-semibold rounded-lg px-4 py-3 mt-2 shadow hover:scale-[1.02] hover:shadow-xl transition-all duration-200"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </button>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a
            href="/pages/auth/sign-up/organisation"
            className="text-blue-600 hover:underline"
          >
            Sign up
          </a>
        </div>
      </form>
    </>
  );
};

export default OrgLoginForm;
