"use client";

import React, { useEffect, useState } from "react";
import { authenticateOrgWithSessionCookie } from "@/lib/actions/org.actions";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import Link from "next/link";
import OrgSideMenuComp from "./_components/OrgSideMenuComp";
import OrgDetailsComp from "./_components/OrgDetailsComp";
import ApiKeyComp from "./_components/ApiKeyComp";
import UsageComp from "./_components/UsageComp";
import ApiKeyDoc from "./_components/ApiKeyDoc";
import { FiLock, FiBriefcase } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export const OrgDashboardComp: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [organisation, setOrganisation] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selected, setSelected] = useState("Details");
  const [countdown, setCountdown] = useState<number | null>(null);

  const startAutoRedirect = (errorMsg: string) => {
    setOrganisation(null);
    setAuthError(errorMsg);
    setCountdown(3);
  };

  const verifyOrg = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const sessionCookie = document.cookie
        .split(";")
        .map((row) => row.trim())
        .find((row) => row.startsWith("session="))
        ?.slice("session=".length);

      if (!sessionCookie) {
        startAutoRedirect("Authentication required. No active session found.");
        return;
      }

      const orgRes = await authenticateOrgWithSessionCookie(sessionCookie);
      if (orgRes.ok && orgRes.organisation) {
        setOrganisation(orgRes.organisation);
      } else {
        const errorMsg = orgRes.message || "Failed to fetch organisation details.";
        toast.error(errorMsg);
        startAutoRedirect(errorMsg);
      }
    } catch (e: any) {
      const errorMsg = e?.message || "Authentication failed.";
      toast.error(errorMsg);
      startAutoRedirect(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyOrg();

    // Multi-tab and cross-component session synchronization
    const handleSessionChanged = () => {
      const hasSession = document.cookie
        .split(";")
        .map((row) => row.trim())
        .some((row) => row.startsWith("session="));
      if (!hasSession) {
        startAutoRedirect("Session terminated. Redirecting to login...");
      } else {
        verifyOrg();
      }
    };

    window.addEventListener("sessionChanged", handleSessionChanged);
    window.addEventListener("storage", handleSessionChanged);

    return () => {
      window.removeEventListener("sessionChanged", handleSessionChanged);
      window.removeEventListener("storage", handleSessionChanged);
    };
  }, []);

  // Handle countdown for auto-redirect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      router.replace("/pages/auth/login/organisation?redirect=/pages/organisation/dashboard");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <Loader />
      </div>
    );
  }

  if (!organisation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors p-4">
        <div className="max-w-md w-full glass-panel-elevated p-8 rounded-3xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center mb-4">
            <FiLock size={22} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
            {authError || "Please sign in to access your organization dashboard and API credentials."}
          </p>

          {countdown !== null && (
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Redirecting to sign in in {countdown}s...
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pages/auth/login/organisation?redirect=/pages/organisation/dashboard">
              <Button variant="success" size="md">
                Sign In Now
              </Button>
            </Link>
            <Link href="/pages/auth/sign-up/organisation">
              <Button variant="outline" size="md">
                Register Organisation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 relative flex transition-colors duration-200">

      {/* Sidebar Navigation */}
      <OrgSideMenuComp
        organisation={organisation}
        selected={selected}
        setSelected={setSelected}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full md:ml-64 md:w-[calc(100%-16rem)] p-6 sm:p-10 min-h-screen transition-all duration-200">
        <div className="max-w-5xl mx-auto">
          {selected === "Details" && (
            <OrgDetailsComp organisation={organisation} />
          )}
          {selected === "API Key" && (
            <ApiKeyComp organisationUid={organisation.uid} />
          )}
          {selected === "Traffic" && (
            <UsageComp organisationUid={organisation.uid} />
          )}
          {selected === "API Documentation" && <ApiKeyDoc />}
          {selected === "Settings" && (
            <div className="glass-panel p-8 rounded-3xl text-center space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Enterprise Settings
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Organization member scopes, webhooks, and billing settings are managed under your enterprise tier.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrgDashboardComp;
