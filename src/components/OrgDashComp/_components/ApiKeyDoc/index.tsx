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
      <pre className="bg-gray-100 rounded p-2 mt-1 text-xs sm:text-sm w-full max-w-full whitespace-pre-wrap break-words overflow-x-auto font-mono">
        {code}
      </pre>
      <button
        type="button"
        className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 p-1 rounded transition focus:outline-none bg-white shadow"
        onClick={handleCopy}
        aria-label="Copy code"
      >
        <FiCopy size={16} />
      </button>
      {copied && (
        <span className="absolute top-2 right-10 text-xs text-green-600 bg-white px-2 py-1 rounded shadow">
          Copied!
        </span>
      )}
    </div>
  );
};

const ApiKeyDoc: React.FC = () => (
  <div className="bg-white p-4 sm:p-8 rounded-lg border border-blue-100 shadow-sm w-full h-full max-w-full">
    <h2 className="text-2xl font-bold text-blue-700 mb-4">API Key Documentation</h2>
    <p className="mb-4 text-gray-700 text-xs sm:text-sm">
      <strong>API Key Usage:</strong> <br />
      Your API key is a unique identifier for your organisation. It must be included in every API request to authenticate and track usage.
    </p>
    <h3 className="text-lg font-semibold text-blue-700 mb-2">Login Endpoint</h3>
    <p className="mb-2 text-gray-700 text-xs sm:text-sm">
      <strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">POST /api/login</code>
    </p>
    <p className="mb-2 text-gray-700 text-xs sm:text-sm">
      <strong>Required JSON body:</strong>
      <CodeBlock code={`{
  "email": "user@example.com",
  "password": "yourPassword123",
  "apiKey": "yourOrganisationApiKey",
  "type": "login"
}`} />
    </p>
    <p className="mb-2 text-gray-700 text-xs sm:text-sm">
      <strong>Response (success):</strong>
      <CodeBlock code={`{
  "ok": true,
  "idToken": "...",
  "message": "Login successful"
}`} />
    </p>
    <p className="mb-2 text-gray-700 text-xs sm:text-sm">
      <strong>Response (error):</strong>
      <CodeBlock code={`{
  "ok": false,
  "error": "Invalid API Key.",
  "message": "Invalid API Key."
}`} />
    </p>
    <p className="mt-4 text-gray-700 text-xs sm:text-sm">
      <strong>Note:</strong> The <code>type</code> parameter should be set to <code>"login"</code> for login requests. For other endpoints, use the appropriate type.
    </p>
  </div>
);

export default ApiKeyDoc;
