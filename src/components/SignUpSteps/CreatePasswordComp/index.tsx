"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep, selectCurrentStep } from "../../../redux/features/signUpSteps/stepSlice";
import { setUserData, selectUserData } from "../../../redux/features/userData/userDataSlice";
import { FiArrowLeft, FiArrowRight, FiLock, FiMail, FiKey } from "react-icons/fi";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface EmailPasswordState {
  email: string;
  password: string;
  confirmPassword: string;
}

export const CreatePasswordComp: React.FC = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);
  const userData = useSelector(selectUserData);

  const [form, setForm] = useState<EmailPasswordState>({
    email: userData.email || "",
    password: "",
    confirmPassword: "",
  });
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
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    dispatch(setUserData({ email: form.email, password: form.password }));
    dispatch(setCurrentStep(currentStep + 1));
  };

  const isValid = !!form.email && !!form.password && !!form.confirmPassword && form.password === form.confirmPassword;

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40">
            <FiKey size={18} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Create Account Credentials
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Set up your primary login email and a secure encryption password.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 space-y-4">
        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="your.email@domain.com"
          value={form.email}
          onChange={handleChange}
          leftIcon={<FiMail size={16} />}
          required
        />

        <Input
          label="Account Password"
          id="password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={handleChange}
          leftIcon={<FiLock size={16} />}
          required
        />

        <Input
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter password"
          value={form.confirmPassword}
          onChange={handleChange}
          leftIcon={<FiLock size={16} />}
          required
        />

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          leftIcon={<FiArrowLeft size={16} />}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!isValid}
          rightIcon={<FiArrowRight size={16} />}
        >
          Review Data & Mint
        </Button>
      </div>
    </div>
  );
};

export default CreatePasswordComp;
