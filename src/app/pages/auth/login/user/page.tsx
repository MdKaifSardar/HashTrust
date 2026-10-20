"use client";
import React, { Suspense, useEffect, useState } from "react";
import UserLoginFormComponent from "@/components/UserLoginFormComponent";
import Loader from "@/components/Loader";

export default function LoginPage() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check for session cookie
    const hasSession = document.cookie
      .split(";")
      .map((row) => row.trim())
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
    <div className="min-h-screen flex items-center justify-center w-full bg-auth-gradient dark:bg-slate-950 transition-colors duration-200 relative">
      <Suspense fallback={<Loader />}>
        <UserLoginFormComponent />
      </Suspense>
    </div>
  );
}
