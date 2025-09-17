"use client";
import LoginFormComponent from "@/components/LoginFormComponent";
import { ToastContainer } from "react-toastify";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <ToastContainer />
      <div className="w-full max-w-lg">
        <LoginFormComponent />
      </div>
    </div>
  );
}
