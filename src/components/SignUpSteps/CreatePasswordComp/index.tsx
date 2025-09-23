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
          className="flex items-center justify-center w-12 h-12 rounded-full font-semibold bg-gray-200 text-blue-700 hover:bg-gray-300"
        >
          <FiChevronLeft size={28} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!form.email || !form.password || !form.confirmPassword}
          className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold ${
            !form.email || !form.password || !form.confirmPassword
              ? "bg-green-300 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          <FiChevronRight size={28} />
        </button>
      </div>

      <div className="h-fit flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-blue-700 text-center">Email &amp; Password</h2>
        <div className="w-full flex flex-col gap-6">
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-5 py-3 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50 text-base"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg px-5 py-3 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50 text-base"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-semibold text-sm"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg px-5 py-3 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50 text-base"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-semibold text-sm"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default CreatePasswordComp;
