"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LogoutModal from "@/components/Navbar/_components/LogoutModal";
import SideMenu from "@/components/Navbar/_components/SideMenu";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function LayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  // Only use session cookie for authentication state
  const hasSessionCookie = () =>
    typeof document !== "undefined" &&
    document.cookie
      .split(";")
      .map((row) => row.trim())
      .some((row) => row.startsWith("session="));

  useEffect(() => {
    // Block access to /auth/* if session cookie exists
    if (
      typeof window !== "undefined" &&
      pathname.includes("/auth") &&
      hasSessionCookie()
    ) {
      router.replace("/");
    }
    // Listen for logout modal trigger from SideMenu
    const showLogoutModalHandler = () => setShowLogoutModal(true);
    window.addEventListener("showLogoutModal", showLogoutModalHandler);
    return () =>
      window.removeEventListener("showLogoutModal", showLogoutModalHandler);
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
    // 1. Wipe Cookie across all possible path variations
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "session=; path=/; max-age=0; SameSite=Strict; Secure";

    // 2. Dispatch cross-tab and cross-component broadcast events
    window.dispatchEvent(new Event("sessionChanged"));
    window.dispatchEvent(new Event("logoutConfirmed"));

    // 3. Clear sensitive storage
    localStorage.removeItem("last_session_role");

    setShowLogoutModal(false);

    // 4. Hard Page Reload & Redirect (Guarantees all in-memory React state is destroyed)
    window.location.href = "/";
  };

  const isAuthPage = pathname?.includes("/auth");
  const isDashboardPage =
    pathname?.startsWith("/pages/user/dashboard") ||
    pathname?.startsWith("/pages/organisation/dashboard");

  return (
    <>
      {!isAuthPage ? (
        <Navbar
          onLogoutClick={() => setShowLogoutModal(true)}
          onSideMenuToggle={() => setSideMenuOpen((v) => !v)}
        />
      ) : null}
      <AnimatePresence>
        {sideMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setSideMenuOpen(false)}
          >
            <SideMenu
              open={sideMenuOpen}
              setOpen={setSideMenuOpen}
              hasAuth={hasSessionCookie()}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <main className={isAuthPage ? "pt-0" : "pt-[3.5rem]"}>{children}</main>
      {/* Show footer only if navbar is shown and not on dashboard pages */}
      {!isAuthPage && !isDashboardPage ? <Footer /> : null}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}
