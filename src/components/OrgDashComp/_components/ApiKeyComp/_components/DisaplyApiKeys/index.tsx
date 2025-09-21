"use client";
import React, { useEffect, useState } from "react";
import {
  getApiKeysForOrg,
  deleteApiKeyById,
} from "@/lib/actions/apikey.actions";
import { toast } from "react-toastify";
import { FiCopy, FiTrash2 } from "react-icons/fi";

const ConfirmModal = ({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
        <h3 className="text-lg font-bold text-blue-700 mb-4">Delete API Key</h3>
        <p className="mb-6 text-gray-700 text-center">
          Are you sure you want to delete this API key?
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function maskApiKey(apiKey: string) {
  if (!apiKey || apiKey.length < 8) return "********";
  return `${apiKey.slice(0, 4)}.....${apiKey.slice(-4)}`;
}

const DisplayApiKeys = ({
  organisationUid,
  refresh,
}: {
  organisationUid?: string;
  refresh?: boolean;
}) => {
  const [apiKeys, setApiKeys] = useState<
    Array<{ id?: string; apiKey: string; createdAt: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      // Get session cookie from browser
      const sessionCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session="))
        ?.split("=")[1];
      if (!sessionCookie) {
        toast.error("Not authenticated.");
        setLoading(false);
        return;
      }
      const res = await getApiKeysForOrg({ sessionCookie, organisationUid });
      if (res.ok && res.apiKeys) {
        setApiKeys(res.apiKeys);
      } else {
        toast.error(res.message || "Failed to fetch API Keys.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to fetch API Keys.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, organisationUid]);

  const handleDeleteClick = (id: string | undefined) => {
    setDeleteKeyId(id || null);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteKeyId) {
      toast.error("API Key ID not found.");
      setDeleteModalOpen(false);
      return;
    }
    setLoading(true);
    try {
      const idToken = localStorage.getItem("authToken");
      if (!idToken) {
        toast.error("Not authenticated.");
        setLoading(false);
        setDeleteModalOpen(false);
        return;
      }
      const res = await deleteApiKeyById(deleteKeyId, idToken);
      if (res.ok) {
        toast.success(res.message || "API Key deleted!");
        await fetchApiKeys(); // Reload API keys after deletion
      } else {
        toast.error(res.message || "Failed to delete API Key.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete API Key.");
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setDeleteKeyId(null);
    }
  };

  return (
    <div className="mt-6">
      <div className="text-gray-700 font-semibold mb-2">Your API Keys:</div>
      {loading && <div className="text-blue-600">Loading...</div>}
      {apiKeys.length === 0 && !loading && (
        <div className="text-gray-500">No API Keys found.</div>
      )}
      <ul className="space-y-4">
        {apiKeys.map((key, idx) => (
          <li
            key={(key.id || key.apiKey) + idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-blue-50 rounded-lg px-3 py-2 border border-blue-200 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-blue-700 text-base sm:text-lg select-all bg-white px-2 py-1 rounded border border-blue-200">
                {maskApiKey(key.apiKey)}
              </span>
              <button
                type="button"
                title="Copy"
                aria-label="Copy API Key"
                onClick={() => {
                  navigator.clipboard.writeText(key.apiKey);
                  toast.success("API Key copied to clipboard!");
                }}
                className="text-blue-600 hover:text-blue-800 transition p-1 rounded focus:outline-none"
              >
                <FiCopy size={18} />
              </button>
              <button
                type="button"
                title="Delete"
                aria-label="Delete API Key"
                onClick={() => handleDeleteClick(key.id)}
                className="text-red-600 hover:text-red-800 transition p-1 rounded focus:outline-none"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 sm:mt-0 sm:ml-4 flex items-center">
              <span>
                Created:{" "}
                {key.createdAt
                  ? new Date(key.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmModal
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default DisplayApiKeys;
