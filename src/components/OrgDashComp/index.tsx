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
  const [selected, setSelected] = useState("Details");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const verifyOrg = async () => {
      setLoading(true);
      try {
        // Get session cookie from browser
        const sessionCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("session="))
          ?.split("=")[1];
        if (!sessionCookie) {
          toast.error("Not authenticated. Please log in.");
          setOrganisation(null);
          setLoading(false);
          return;
        }
        // Use the org.actions function directly
        const orgRes = await authenticateOrgWithSessionCookie(sessionCookie);
        if (orgRes.ok && orgRes.organisation) {
          setOrganisation(orgRes.organisation);
        } else {
          toast.error(orgRes.message || "Failed to fetch organisation.");
          setOrganisation(null);
        }
      } catch (e: any) {
        toast.error(e?.message || "Authentication failed.");
        setOrganisation(null);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (!organisation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-red-600 font-semibold mb-4">
          Not authenticated
        </div>
        <div className="text-gray-600 mb-2">
          Please{" "}
          <a
            href="/pages/auth/sign-up/organisation"
            className="text-blue-600 underline font-semibold"
          >
            sign up
          </a>{" "}
          or{" "}
          <a
            href="/pages/auth/login/organisation"
            className="text-blue-600 underline font-semibold"
          >
            log in
          </a>{" "}
          to access your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 relative flex">
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
            <div className="bg-white p-8 rounded-lg border border-blue-100 shadow-sm w-full h-full flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Settings</h2>
              <div className="text-gray-600">Settings options go here.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgDashboardComp;
