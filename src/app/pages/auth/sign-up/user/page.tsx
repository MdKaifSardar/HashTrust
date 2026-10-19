"use client";
import React from "react";
import SignUpFormComponent from "../../../../../components/SignUpFormComponent";

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors">
      <SignUpFormComponent />
    </div>
  );
};

export default SignUpPage;
