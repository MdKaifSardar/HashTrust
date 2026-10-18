"use client";
import SignUpFormComponent from "../../../../../components/SignUpFormComponent";
import { ToastContainer } from "react-toastify";

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-slate-950 transition-colors">
      <SignUpFormComponent />
      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
