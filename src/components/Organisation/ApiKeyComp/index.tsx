"use client";
import React, { useState } from "react";
import { createApiKeyForOrg } from "@/lib/actions/apikey.actions";
import { toast } from "react-toastify";

const ApiKeyComp: React.FC<{ organisationUid?: string }> = ({ organisationUid }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
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
        setApiKey(res.apiKey);
        toast.success(res.message || "API Key created!");
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
    <div className="bg-white p-8 rounded-lg border border-blue-100 shadow-sm max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-blue-700 mb-4">API Key Management</h2>
      <button
        type="button"
        onClick={handleCreateApiKey}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-700 transition"
      >
        {loading ? "Creating..." : "Create API Key"}
      </button>
      {apiKey && (
        <div className="mt-6">
          <div className="text-gray-700 font-semibold mb-2">Your API Key:</div>
          <div className="font-mono text-blue-600 break-all">{apiKey}</div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyComp;
