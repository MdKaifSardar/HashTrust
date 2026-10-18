"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep, selectCurrentStep } from "../../../redux/features/signUpSteps/stepSlice";
import { setUserData, selectUserData } from "../../../redux/features/userData/userDataSlice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface EmailPasswordState {
  email: string;
  password: string;
  confirmPassword: string;
}

const CreatePasswordComp: React.FC = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);
  const userData = useSelector(selectUserData);

  const [form, setForm] = useState<EmailPasswordState>({
    email: userData.email || "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handlePrev = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  const handleNext = () => {
    if (!form.email) {
      setError("Please enter your email.");
      return;
    }
    if (!form.password || !form.confirmPassword) {
      setError("Please enter and confirm your password.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Save email and password to redux userData slice
    dispatch(setUserData({ email: form.email, password: form.password }));
    dispatch(setCurrentStep(currentStep + 1));
  };

  return (
    <div className="bg-transparent flex flex-col justify-center items-center w-full min-h-screen h-full rounded-lg relative">
      {/* Top navigation buttons at top corners */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-2 py-2 z-10">
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center justify-center w-12 h-12 rounded-full font-semibold bg-gray-200 dark:bg-slate-800 text-blue-700 dark:text-cyan-400 hover:bg-gray-300 dark:hover:bg-slate-700 transition"
        >
          <FiChevronLeft size={28} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!form.email || !form.password || !form.confirmPassword}
          className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition ${
            !form.email || !form.password || !form.confirmPassword
              ? "bg-green-300 dark:bg-emerald-900/50 text-white dark:text-emerald-700 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 shadow-lg"
          }`}
        >
          <FiChevronRight size={28} />
        </button>
      </div>

      <div className="w-full max-w-md flex flex-col items-center justify-center ">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-blue-100 dark:border-slate-800 px-8 py-10 w-full transition-colors">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-slate-100 text-center transition-colors">Email &amp; Password</h2>
          <form className="w-full flex flex-col gap-6">
            <div>
              <label className="block font-semibold mb-1 text-blue-700 dark:text-slate-200 text-sm transition-colors">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-blue-200 dark:border-slate-700 rounded-lg px-5 py-3 focus:ring-2 focus:ring-blue-300 dark:focus:ring-cyan-500/50 focus:outline-none bg-blue-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base transition-colors"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700 dark:text-slate-200 text-sm transition-colors">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-blue-200 dark:border-slate-700 rounded-lg px-5 py-3 focus:ring-2 focus:ring-blue-300 dark:focus:ring-cyan-500/50 focus:outline-none bg-blue-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base transition-colors"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-cyan-400 font-semibold text-sm hover:underline"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700 dark:text-slate-200 text-sm transition-colors">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-blue-200 dark:border-slate-700 rounded-lg px-5 py-3 focus:ring-2 focus:ring-blue-300 dark:focus:ring-cyan-500/50 focus:outline-none bg-blue-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base transition-colors"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-cyan-400 font-semibold text-sm hover:underline"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {error && <div className="text-red-600 dark:text-red-400 text-center text-sm font-semibold mt-2">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePasswordComp;
