"use client";
import React, { useEffect, useState } from "react";
import { fetchOrgDetailsWithIdToken } from "@/lib/actions/org.actions";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import OrgSideMenuComp from "../OrgSideMenuComp";
import OrgDetailsComp from "../OrgDetailsComp";
import ApiKeyComp from "../ApiKeyComp";

const OrgDashboardComp: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [organisation, setOrganisation] = useState<any>(null);
  const [selected, setSelected] = useState("Details");

  useEffect(() => {
    const verifyOrg = async () => {
      setLoading(true);
      try {
        const idToken = localStorage.getItem("authToken");
        if (!idToken) {
          toast.error("You are not signed in. Please sign up or log in.");
          setLoading(false);
          setOrganisation(null);
          return;
        }
        // Fetch the organisation using the idToken
        const orgRes = await fetchOrgDetailsWithIdToken(idToken);
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
        <div className="text-gray-600">
          Please sign up or log in to access your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Side Menu */}
      <OrgSideMenuComp
        organisation={organisation}
        selected={selected}
        setSelected={setSelected}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start py-12 px-4 md:px-8">
        <div className="w-full max-w-3xl">
          {selected === "Details" && <OrgDetailsComp organisation={organisation} />}
          {selected === "API Key" && (
            <ApiKeyComp organisationUid={organisation.uid} />
          )}
          {selected === "Traffic" && (
            <div className="bg-white p-8 rounded-lg border border-blue-100 shadow-sm max-w-xl mx-auto">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Traffic</h2>
              <div className="font-semibold text-gray-800 text-lg">
                {organisation.traffic || "No traffic data available."}
              </div>
            </div>
          )}
          {selected === "Settings" && (
            <div className="bg-white p-8 rounded-lg border border-blue-100 shadow-sm max-w-xl mx-auto">
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
