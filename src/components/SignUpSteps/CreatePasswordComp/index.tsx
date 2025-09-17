"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep, selectCurrentStep } from "../../../redux/features/signUpSteps/stepSlice";
import { setUserData, selectUserData } from "../../../redux/features/userData/userDataSlice";

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
    <div className="max-w-xl mx-auto bg-white rounded-lg flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-bold mb-2 text-blue-700 text-center">Email &amp; Password</h2>
      <div className="w-full flex flex-col gap-4">
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
      <div className="flex gap-4 justify-center mt-2">
        <button
          type="button"
          onClick={handlePrev}
          className="px-6 py-2 rounded font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!form.email || !form.password || !form.confirmPassword}
          className={`px-6 py-2 rounded font-semibold ${
            !form.email || !form.password || !form.confirmPassword
              ? "bg-green-300 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CreatePasswordComp;
