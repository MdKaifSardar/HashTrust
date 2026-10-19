"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { createOrganisation } from "@/lib/actions/org.actions";
import ThemeToggle from "@/components/ThemeToggle";

const OrgSignupComp = () => {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await createOrganisation({
        orgName,
        email,
        password,
        contactPerson,
      });
      setLoading(false);
      if (res.ok && res.sessionCookie) {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        document.cookie = `session=${res.sessionCookie}; path=/; max-age=${60 * 60 * 24 * 5}; SameSite=Lax${isSecure ? "; Secure" : ""}`;
        setSuccess(res.message || "Organisation account created successfully!");
        toast.success(res.message || "Organisation account created successfully!");
        setTimeout(() => {
          window.location.href = "/pages/organisation/dashboard";
        }, 1200);
      } else {
        setError(res.message || "Sign up failed.");
        toast.error(res.message || "Sign up failed.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Sign up failed.");
      toast.error(err?.message || "Sign up failed.");
    }
  };

  return (
    <>
      <ToastContainer />
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
          Organisation Sign Up
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label
              className="text-blue-700 dark:text-slate-200 font-semibold text-sm transition-colors"
              htmlFor="orgName"
            >
              Organisation Name
            </label>
            <input
              id="orgName"
              type="text"
              placeholder="Organisation Name"
              className="border border-blue-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 dark:focus:ring-cyan-500/50 focus:outline-none bg-blue-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-blue-700 dark:text-slate-200 font-semibold text-sm transition-colors"
              htmlFor="contactPerson"
            >
              Contact Person
            </label>
            <input
              id="contactPerson"
              type="text"
              placeholder="Contact Person"
              className="border border-blue-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 dark:focus:ring-cyan-500/50 focus:outline-none bg-blue-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              className="text-blue-700 dark:text-slate-200 font-semibold text-sm transition-colors"
              htmlFor="email"
            >
              Organisation Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Organisation Email"
              className="border border-blue-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 dark:focus:ring-cyan-500/50 focus:outline-none bg-blue-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              className="text-blue-700 dark:text-slate-200 font-semibold text-sm transition-colors"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="border border-blue-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 dark:focus:ring-cyan-500/50 focus:outline-none bg-blue-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 text-white font-semibold rounded-lg px-4 py-3 mt-2 shadow hover:scale-[1.02] hover:shadow-xl transition-all duration-200"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        {error && (
          <div className="text-red-600 text-center text-sm mt-2">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-center text-sm mt-2">
            {success}
          </div>
        )}
      </form>
    </>
  );
};

export default OrgSignupComp;
