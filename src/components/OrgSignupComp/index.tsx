"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

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
    // Call API route that sets session cookie
    const res = await fetch("/api/org-signup", {
      method: "POST",
      body: JSON.stringify({ orgName, email, password, contactPerson }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setSuccess(data.message);
      toast.success(data.message);
      // Session cookie is set by backend, no need to store token in localStorage
      setTimeout(() => {
        window.location.href = "/pages/organisation/dashboard";
      }, 1200);
    } else {
      setError(data.message);
      toast.error(data.message);
    }
  };

  return (
    <>
      <ToastContainer />
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
        className="w-full max-w-lg mx-auto bg-white/90 rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-8 border border-blue-100 backdrop-blur-md"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400">
          Organisation Sign Up
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label
              className="text-blue-700 font-semibold text-sm"
              htmlFor="orgName"
            >
              Organisation Name
            </label>
            <input
              id="orgName"
              type="text"
              placeholder="Organisation Name"
              className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-blue-700 font-semibold text-sm"
              htmlFor="contactPerson"
            >
              Contact Person
            </label>
            <input
              id="contactPerson"
              type="text"
              placeholder="Contact Person"
              className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              className="text-blue-700 font-semibold text-sm"
              htmlFor="email"
            >
              Organisation Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Organisation Email"
              className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              className="text-blue-700 font-semibold text-sm"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50"
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
