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

const AvailableApi: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg border border-blue-100 dark:border-slate-800 shadow-sm w-full mt-8 max-w-full transition-colors">
    <h2 className="text-xl font-bold text-blue-700 dark:text-cyan-400 mb-4 transition-colors">Available API Endpoints</h2>
    <ul className="space-y-6">
      <li>
        <strong className="text-slate-900 dark:text-slate-100">POST /api/v1/login/user</strong>
        <div className="text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
          Authenticate a user.<br />
          <strong>Body:</strong>
          <CodeBlock code={`{
  "email": "user@example.com",
  "password": "yourPassword123",
  "apiKey": "yourOrganisationApiKey",
  "type": "login"
}`} />
        </div>
      </li>
      <li>
        <strong className="text-slate-900 dark:text-slate-100">POST /api/fetch-user-data</strong>
        <div className="text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
          Fetch user data using an API key and token.<br />
          <strong>Body:</strong>
          <CodeBlock code={`{
  "idToken": "userIdToken",
  "apiKey": "yourOrganisationApiKey",
  "type": "fetch-user-data"
}`} />
        </div>
      </li>
      <li>
        <strong className="text-slate-900 dark:text-slate-100">POST /api/other-endpoint</strong>
        <div className="text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
          Description of other endpoint.<br />
          <strong>Body:</strong>
          <CodeBlock code={`{
  "apiKey": "yourOrganisationApiKey",
  "type": "other-type",
  // other parameters
}`} />
        </div>
      </li>
    </ul>
    <p className="mt-4 text-gray-700 dark:text-slate-400 text-xs sm:text-sm">
      <strong>Note:</strong> Always include your API key and the correct <code>type</code> for each request.
    </p>
  </div>
);

export default AvailableApi;
