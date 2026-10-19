"use client";
import React, { useEffect, useState } from "react";
import { authenticateOrgWithSessionCookie } from "@/lib/actions/org.actions";
import Loader from "@/components/Loader";
import { toast, ToastContainer } from "react-toastify";
import OrgSideMenuComp from "./_components/OrgSideMenuComp";
import OrgDetailsComp from "./_components/OrgDetailsComp";
import ApiKeyComp from "./_components/ApiKeyComp";
import UsageComp from "./_components/UsageComp";
import ApiKeyDoc from "./_components/ApiKeyDoc";

const OrgDashboardComp: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [organisation, setOrganisation] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selected, setSelected] = useState("Details");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const verifyOrg = async () => {
      setLoading(true);
      setAuthError(null);
      try {
        // Get session cookie from browser if available
        const sessionCookie = document.cookie
          .split(";")
          .map((row) => row.trim())
          .find((row) => row.startsWith("session="))
          ?.slice("session=".length);

        // Server action will check sessionCookie or fallback to HTTP headers cookies()
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

  // Responsive: menu closed by default on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setMenuOpen(false);
      else setMenuOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
        <Loader />
      </div>
    );
  }

  if (!organisation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors p-4">
        <ToastContainer />
        <div className="text-xl text-red-600 dark:text-red-400 font-semibold mb-2">
          Not authenticated
        </div>
        {authError && (
          <div className="text-xs sm:text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-900 rounded-lg px-4 py-2 mb-4 max-w-md text-center font-mono">
            {authError}
          </div>
        )}
        <div className="text-gray-600 dark:text-slate-300 mb-2">
          Please{" "}
          <a
            href="/pages/auth/sign-up/organisation"
            className="text-blue-600 dark:text-cyan-400 underline font-semibold"
          >
            sign up
          </a>{" "}
          or{" "}
          <a
            href="/pages/auth/login/organisation"
            className="text-blue-600 dark:text-cyan-400 underline font-semibold"
          >
            log in
          </a>{" "}
          to access your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 relative flex transition-colors">
      <ToastContainer />
      {/* Sidebar is now handled inside OrgSideMenuComp */}
      <OrgSideMenuComp
        organisation={organisation}
        selected={selected}
        setSelected={setSelected}
      />
      {/* Main Content */}
      <div className="flex flex-col items-center justify-start h-fit p-1 sm:p-4 transition-all duration-300 flex-1 w-full md:ml-64 md:w-[calc(100vw-16rem)]">
        <div className="w-full h-full flex flex-col justify-start items-center">
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
            <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-blue-100 dark:border-slate-800 shadow-sm w-full h-full flex flex-col justify-center items-center transition-colors">
              <h2 className="text-xl font-bold text-blue-700 dark:text-slate-100 mb-4">Settings</h2>
              <div className="text-gray-600 dark:text-slate-400">Settings options go here.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgDashboardComp;
