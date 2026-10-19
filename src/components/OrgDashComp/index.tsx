"use client";

import React, { useEffect, useState } from "react";
import { authenticateOrgWithSessionCookie } from "@/lib/actions/org.actions";
import Loader from "@/components/Loader";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import OrgSideMenuComp from "./_components/OrgSideMenuComp";
import OrgDetailsComp from "./_components/OrgDetailsComp";
import ApiKeyComp from "./_components/ApiKeyComp";
import UsageComp from "./_components/UsageComp";
import ApiKeyDoc from "./_components/ApiKeyDoc";
import { FiLock, FiBriefcase } from "react-icons/fi";
import Button from "@/components/ui/Button";

export const OrgDashboardComp: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [organisation, setOrganisation] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selected, setSelected] = useState("Details");

  useEffect(() => {
    const verifyOrg = async () => {
      setLoading(true);
      setAuthError(null);
      try {
        const sessionCookie = document.cookie
          .split(";")
          .map((row) => row.trim())
          .find((row) => row.startsWith("session="))
          ?.slice("session=".length);

        const orgRes = await authenticateOrgWithSessionCookie(sessionCookie);
        if (orgRes.ok && orgRes.organisation) {
          setOrganisation(orgRes.organisation);
        } else {
          setOrganisation(null);
          const errorMsg = orgRes.message || "Failed to fetch organisation details.";
          setAuthError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (e: any) {
        const errorMsg = e?.message || "Authentication failed.";
        setOrganisation(null);
        setAuthError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    verifyOrg();
  }, []);

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
        <ToastContainer />
        <div className="max-w-md w-full glass-panel-elevated p-8 rounded-3xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center mb-4">
            <FiLock size={22} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            {authError || "Please sign in to access your organization dashboard and API credentials."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pages/auth/login/organisation">
              <Button variant="success" size="md">
                Organisation Sign In
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
      <ToastContainer position="top-right" />

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
