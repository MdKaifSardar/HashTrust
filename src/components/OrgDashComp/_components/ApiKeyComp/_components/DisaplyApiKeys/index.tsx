"use client";

import React, { useEffect, useState } from "react";
import {
  getApiKeysForOrg,
  deleteApiKeyById,
} from "@/lib/actions/apikey.actions";
import { toast } from "react-toastify";
import { FiCopy, FiTrash2, FiKey, FiEye, FiEyeOff } from "react-icons/fi";
import Button from "@/components/ui/Button";

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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center border border-slate-200 dark:border-white/10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mb-4">
          <FiTrash2 size={22} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Revoke API Key
        </h3>
        <p className="mb-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Any external services or clients currently relying on this key will immediately lose access.
        </p>
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Revoke Key
          </Button>
        </div>
      </div>
    </div>
  );
};

function maskApiKey(apiKey: string) {
  if (!apiKey || apiKey.length < 8) return "••••••••••••••••";
  return `${apiKey.slice(0, 6)}••••••••••••••••${apiKey.slice(-4)}`;
}

export const DisplayApiKeys = ({
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
  const [showModal, setShowModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState<{ id?: string } | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const sessionCookie = document.cookie
        .split(";")
        .map((row) => row.trim())
        .find((row) => row.startsWith("session="))
        ?.slice("session=".length);

      if (!sessionCookie) {
        setApiKeys([]);
        setLoading(false);
        return;
      }
      const res = await getApiKeysForOrg({ sessionCookie, organisationUid });
      if (res.ok && res.apiKeys) {
        setApiKeys(res.apiKeys);
      } else {
        setApiKeys([]);
      }
    } catch {
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, [refresh, organisationUid]);

  const handleCopy = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard!");
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = (keyObj: { id?: string }) => {
    setSelectedKey(keyObj);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedKey?.id) {
      toast.error("Cannot delete: Key ID is missing.");
      setShowModal(false);
      return;
    }
    try {
      const sessionCookie = document.cookie
        .split(";")
        .map((row) => row.trim())
        .find((row) => row.startsWith("session="))
        ?.slice("session=".length);

      const res = await deleteApiKeyById(selectedKey.id, sessionCookie || "");
      if (res.ok) {
        toast.success(res.message || "API Key deleted.");
        fetchKeys();
      } else {
        toast.error(res.message || "Failed to delete API Key.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete API Key.");
    } finally {
      setShowModal(false);
      setSelectedKey(null);
    }
  };

  return (
    <div className="w-full mt-6">
      <ConfirmModal
        open={showModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowModal(false);
          setSelectedKey(null);
        }}
      />

      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
        Active API Credentials
      </h3>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading keys...</div>
      ) : apiKeys.length === 0 ? (
        <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 text-center">
          <FiKey size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No API Keys Generated
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Generate your first key above to begin authenticating verification requests.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((k) => {
            const keyId = k.id || k.apiKey;
            const isRevealed = revealedKeys[keyId];

            return (
              <div
                key={keyId}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white select-all">
                      {isRevealed ? k.apiKey : maskApiKey(k.apiKey)}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleReveal(keyId)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded"
                      title={isRevealed ? "Hide key" : "Reveal key"}
                    >
                      {isRevealed ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Created on {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "Active"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(k.apiKey)}
                    leftIcon={<FiCopy size={13} />}
                  >
                    Copy Key
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDelete(k)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Revoke key"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DisplayApiKeys;
