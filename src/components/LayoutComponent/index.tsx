"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LogoutModal from "@/components/Navbar/_components/LogoutModal";
import { usePathname, useRouter } from "next/navigation";

export default function LayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Only use session cookie for authentication state
  const hasSessionCookie = () =>
    typeof document !== "undefined" &&
    document.cookie.split("; ").some((row) => row.startsWith("session="));

  useEffect(() => {
    // Block access to /auth/* if session cookie exists
    if (
      typeof window !== "undefined" &&
      pathname.includes("/auth") &&
      hasSessionCookie()
    ) {
      router.replace("/");
    }
  }, [pathname, router]);

  // Return null for the entire layout if blocking access
  if (
    pathname.includes("/auth") &&
    typeof window !== "undefined" &&
    hasSessionCookie()
  ) {
    return null;
  }

  const handleLogout = () => {
    document.cookie = "session=; path=/; max-age=0; SameSite=Strict; Secure";
    window.dispatchEvent(new Event("sessionChanged"));
    setShowLogoutModal(false);
    router.push("/");
  };

  const isAuthPage = pathname?.includes("/auth");

  return (
    <>
      {!isAuthPage ? (
        <Navbar onLogoutClick={() => setShowLogoutModal(true)} />
      ) : null}
      <main className={isAuthPage ? "pt-0" : "pt-[3.5rem]"}>{children}</main>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}
