"use client";

import React, { useState } from "react";
import { FiCopy, FiCheck, FiBookOpen } from "react-icons/fi";

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative group mt-2">
      <pre className="bg-slate-900 text-slate-100 dark:bg-slate-950 dark:text-slate-200 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm w-full whitespace-pre-wrap break-words overflow-x-auto font-mono">
        {code}
      </pre>
      <button
        type="button"
        className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1.5 rounded-lg transition bg-slate-800 hover:bg-slate-700 border border-slate-700"
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? <FiCheck size={14} className="text-emerald-400" /> : <FiCopy size={14} />}
      </button>
    </div>
  );
};

export const ApiKeyDoc: React.FC = () => (
  <div className="w-full space-y-8">
    <div className="pb-6 border-b border-slate-200/80 dark:border-white/10">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40">
          <FiBookOpen size={16} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          API Integration Documentation
        </h1>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        Reference guide for verifying and onboarding users programmatically with HashTrust.
      </p>
    </div>

    {/* Section: Overview */}
    <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Authentication Protocol
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Your organization API key authenticates every request and tracks verification quota. Include it in the JSON request body or in the request headers.
        </p>
      </div>

      <div className="space-y-6 pt-4 border-t border-slate-200/60 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              POST
            </span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              /api/v1/login/user
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit user credentials with your organization API key to verify biometric identity.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-400">Request Body (JSON)</span>
            <CodeBlock
              code={`{
  "email": "user@example.com",
  "password": "yourPassword123",
  "apiKey": "yourOrganisationApiKey",
  "type": "login"
}`}
            />
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-500">Success Response (200 OK)</span>
            <CodeBlock
              code={`{
  "ok": true,
  "message": "Login successful",
  "verified": true,
  "proofHash": "0x8e21f...6482104"
}`}
            />
          </div>

          <div>
            <span className="text-xs font-semibold text-rose-500">Error Response (401 Unauthorized)</span>
            <CodeBlock
              code={`{
  "ok": false,
  "error": "Invalid API Key.",
  "message": "Invalid API Key."
}`}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ApiKeyDoc;
