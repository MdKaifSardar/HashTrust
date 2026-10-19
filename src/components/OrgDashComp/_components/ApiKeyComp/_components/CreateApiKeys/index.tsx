"use client";

import React, { useState } from "react";
import { createApiKeyForOrg } from "@/lib/actions/apikey.actions";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import Button from "@/components/ui/Button";

export const CreateApiKeys = ({
  organisationUid,
  onCreated,
}: {
  organisationUid?: string;
  onCreated: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleCreateApiKey = async () => {
    setLoading(true);
    try {
      const sessionCookie = document.cookie
        .split(";")
        .map((row) => row.trim())
        .find((row) => row.startsWith("session="))
        ?.slice("session=".length);

      if (!sessionCookie) {
        toast.error("Not authenticated.");
        setLoading(false);
        return;
      }
      const res = await createApiKeyForOrg({ sessionCookie, organisationUid });
      if (res.ok && res.apiKey) {
        toast.success(res.message || "New API Key created!");
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
    <Button
      variant="success"
      onClick={handleCreateApiKey}
      isLoading={loading}
      leftIcon={<FiPlus size={16} />}
    >
      Generate New API Key
    </Button>
  );
};

export default CreateApiKeys;
