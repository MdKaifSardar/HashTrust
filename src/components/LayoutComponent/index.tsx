"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LogoutModal from "@/components/Navbar/_components/LogoutModal";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Token refresh logic
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("firebase/auth").then(({ getAuth, onIdTokenChanged }) => {
        const { firebaseApp } = require("../../lib/database/firebase");
        const auth = getAuth(firebaseApp);

        let refreshInterval: ReturnType<typeof setInterval>;

        const refreshAuthToken = async (user: any) => {
          try {
            const token = await user.getIdToken(true); // force refresh
            localStorage.setItem("authToken", token);
            window.dispatchEvent(new Event("authTokenChanged"));
          } catch (err) {
            localStorage.removeItem("authToken");
            window.dispatchEvent(new Event("authTokenChanged"));
            toast.error("Session expired. Please log in again.");
          }
        };

        onIdTokenChanged(auth, async (user) => {
          if (user) {
            await refreshAuthToken(user);

            // Refresh token every 55 minutes
            refreshInterval = setInterval(() => refreshAuthToken(user), 55 * 60 * 1000);
          } else {
            clearInterval(refreshInterval);
            localStorage.removeItem("authToken");
            window.dispatchEvent(new Event("authTokenChanged"));
            toast.error("Session expired. Please log in again.");
          }
        });

        // Cleanup interval on unmount
        return () => clearInterval(refreshInterval);
      });
    }
  }, []);

  const handleLogout = () => {
    // Remove session cookie instead of authToken
    document.cookie = "session=; path=/; max-age=0; SameSite=Strict; Secure";
    window.dispatchEvent(new Event("sessionChanged"));
    setShowLogoutModal(false);
    router.push("/");
  };

  useEffect(() => {
    // Block access to /pages/auth/* if authenticated
    if (
      typeof window !== "undefined" &&
      pathname.startsWith("/pages/auth") &&
      document.cookie.split("; ").some((row) => row.startsWith("session="))
    ) {
      router.replace("/");
    }
  }, [pathname, router]);

  if (
    pathname.startsWith("/pages/auth") &&
    typeof window !== "undefined" &&
    document.cookie.split("; ").some((row) => row.startsWith("session="))
  ) {
    // Prevent rendering auth pages if authenticated
    return null;
  }

  return (
    <>
      <Navbar onLogoutClick={() => setShowLogoutModal(true)} />
      <main className="pt-[3.5rem]">{children}</main>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}
