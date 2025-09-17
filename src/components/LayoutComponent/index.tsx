"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LogoutModal from "@/components/Navbar/_components/LogoutModal";
import { usePathname, useRouter } from "next/navigation";

export default function LayoutComponent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("authTokenChanged"));
    setShowLogoutModal(false);
    window.location.href = "/";
  };

  useEffect(() => {
    if (typeof window !== "undefined" && pathname.startsWith("/pages/auth") && localStorage.getItem("authToken")) {
      router.replace("/");
    }
  }, [pathname, router]);

  if (pathname.startsWith("/pages/auth")) {
    return <>{children}</>;
  }
  return (
    <>
      <Navbar onLogoutClick={() => setShowLogoutModal(true)} />
      <main className="pt-[2rem]">{children}</main>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}
