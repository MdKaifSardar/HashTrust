"use client";

import React, { forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, type = "text", className = "", id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            className={`w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 dark:focus:ring-sky-400/30 dark:focus:border-sky-400 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 ${
              leftIcon ? "pl-10" : ""
            } ${rightIcon || isPassword ? "pr-10" : ""} ${
              error
                ? "border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-rose-500/30"
                : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
            } ${className}`}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          ) : (
            rightIcon && (
              <div className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                {rightIcon}
              </div>
            )
          )}
        </div>
        {error ? (
          <span className="text-xs font-medium text-rose-500 dark:text-rose-400">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
