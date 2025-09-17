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
    if (res.ok) {
      toast.success(res.message);
      if (res.idToken) {
        localStorage.setItem("authToken", res.idToken);
        setTimeout(() => {
          router.push("/pages/organisation/dashboard");
        }, 1200);
      }
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
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto bg-white/90 rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-8 border border-blue-100 backdrop-blur-md"
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
      </form>
    </>
  );
};

export default OrgLoginForm;
