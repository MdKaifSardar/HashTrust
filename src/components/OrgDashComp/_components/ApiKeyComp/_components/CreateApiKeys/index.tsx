"use client";
import React, { useState } from "react";
import { createApiKeyForOrg } from "@/lib/actions/apikey.actions";
import { toast } from "react-toastify";

const CreateApiKeys = ({ organisationUid, onCreated }: { organisationUid?: string; onCreated: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleCreateApiKey = async () => {
    setLoading(true);
    try {
      const idToken = localStorage.getItem("authToken");
      if (!idToken) {
        toast.error("Not authenticated.");
        setLoading(false);
        return;
      }
      const res = await createApiKeyForOrg({ idToken, organisationUid });
      if (res.ok && res.apiKey) {
        toast.success(res.message || "API Key created!");
        onCreated();
      } else {
        toast.error(res.message || "Failed to create API Key.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to create API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCreateApiKey}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-700 transition"
    >
      {loading ? "Creating..." : "Create API Key"}
    </button>
  );
};

export default CreateApiKeys;
