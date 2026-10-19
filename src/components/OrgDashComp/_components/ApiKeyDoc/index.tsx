import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="relative group">
      <pre className="bg-gray-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-transparent dark:border-slate-800 rounded p-2 mt-1 text-xs sm:text-sm w-full max-w-full whitespace-pre-wrap break-words overflow-x-auto font-mono transition-colors">
        {code}
      </pre>
      <button
        type="button"
        className="absolute top-2 right-2 text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 p-1 rounded transition focus:outline-none bg-white dark:bg-slate-800 shadow border border-transparent dark:border-slate-700"
        onClick={handleCopy}
        aria-label="Copy code"
      >
        <FiCopy size={16} />
      </button>
      {copied && (
        <span className="absolute top-2 right-10 text-xs text-green-600 dark:text-emerald-400 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow border border-transparent dark:border-slate-700">
          Copied!
        </span>
      )}
    </div>
  );
};

const ApiKeyDoc: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-lg border border-blue-100 dark:border-slate-800 shadow-sm w-full h-full max-w-full transition-colors">
    <h2 className="text-2xl font-bold text-blue-700 dark:text-cyan-400 mb-4 transition-colors">API Key Documentation</h2>
    <p className="mb-4 text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
      <strong className="text-slate-900 dark:text-slate-100">API Key Usage:</strong> <br />
      Your API key is a unique identifier for your organisation. It must be included in every API request to authenticate and track usage.
    </p>
    <h3 className="text-lg font-semibold text-blue-700 dark:text-slate-100 mb-2">Login Endpoint</h3>
    <p className="mb-2 text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
      <strong className="text-slate-900 dark:text-slate-100">Endpoint:</strong> <code className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-blue-600 dark:text-cyan-400 border border-transparent dark:border-slate-700">POST /api/v1/login/user</code>
    </p>
    <div className="mb-2 text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
      <strong className="text-slate-900 dark:text-slate-100">Required JSON body:</strong>
      <CodeBlock code={`{
  "email": "user@example.com",
  "password": "yourPassword123",
  "apiKey": "yourOrganisationApiKey",
  "type": "login"
}`} />
    </div>
    <div className="mb-2 text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
      <strong className="text-slate-900 dark:text-slate-100">Response (success):</strong>
      <CodeBlock code={`{
  "ok": true,
  "message": "Login successful"
}`} />
    </div>
    <div className="mb-2 text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
      <strong className="text-slate-900 dark:text-slate-100">Response (error):</strong>
      <CodeBlock code={`{
  "ok": false,
  "error": "Invalid API Key.",
  "message": "Invalid API Key."
}`} />
    </div>
    <p className="mt-4 text-gray-700 dark:text-slate-400 text-xs sm:text-sm">
      <strong>Note:</strong> The <code>type</code> parameter should be set to <code>"login"</code> for login requests. For other endpoints, use the appropriate type.
    </p>
  </div>
);

export default ApiKeyDoc;
