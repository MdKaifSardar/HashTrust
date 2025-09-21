"use client";
import React, { useState } from "react";
import { loginUser } from "@/lib/actions/user.actions";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginFormComponent: React.FC = () => {
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
      if (res.ok && res.idToken) {
        localStorage.setItem("authToken", res.idToken);
        window.dispatchEvent(new Event("authTokenChanged")); // <-- force Navbar to update
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
        className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-lg px-8 py-10 mt-16"
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
          Sign In
        </h2>
        <div className="mb-5">
          <label className="block font-semibold mb-1 text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="email"
            required
          />
        </div>
        <div className="mb-8">
          <label className="block font-semibold mb-1 text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded font-semibold transition ${
            submitting
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {submitting ? "Logging in..." : "Login"}
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

export default LoginFormComponent;
