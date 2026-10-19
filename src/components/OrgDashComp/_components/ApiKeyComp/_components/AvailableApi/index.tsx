"use client";

import React, { useState } from "react";
import { FiCopy, FiCheck, FiCode } from "react-icons/fi";

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

export const AvailableApi: React.FC = () => (
  <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 w-full mt-8">
    <div className="flex items-center gap-2 mb-6">
      <FiCode className="text-sky-500" size={18} />
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
        Standard API Endpoints
      </h3>
    </div>

    <ul className="space-y-6">
      <li className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            POST
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            /api/v1/login/user
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Authenticate a user and verify cryptographic validity using their email and organisation API key.
        </p>
        <CodeBlock
          code={`{
  "email": "user@example.com",
  "password": "yourPassword123",
  "apiKey": "yourOrganisationApiKey",
  "type": "login"
}`}
        />
      </li>

      <li className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            POST
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            /api/fetch-user-data
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Retrieve verified user payload and smart contract proof attributes using an active ID token.
        </p>
        <CodeBlock
          code={`{
  "idToken": "userIdToken",
  "apiKey": "yourOrganisationApiKey",
  "type": "fetch-user-data"
}`}
        />
      </li>
    </ul>
  </div>
);

export default AvailableApi;
