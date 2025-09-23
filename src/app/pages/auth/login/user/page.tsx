"use client";
import React, { useEffect, useState } from "react";
import LoginFormComponent from "@/components/UserLoginFormComponent";
import { ToastContainer } from "react-toastify";

export default function LoginPage() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check for session cookie
    const hasSession = document.cookie
      .split("; ")
      .some((row) => row.startsWith("session="));
    if (hasSession) {
      window.location.replace("/");
      setShouldRender(false);
    } else {
      setShouldRender(true);
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <ToastContainer />
      <div className="w-full max-w-lg">
        <LoginFormComponent />
      </div>
    </div>
  );
}
