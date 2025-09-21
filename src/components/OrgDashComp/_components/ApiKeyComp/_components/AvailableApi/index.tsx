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

const AvailableApi: React.FC = () => (
  <div className="bg-white p-4 sm:p-6 rounded-lg border border-blue-100 shadow-sm w-full mt-8 max-w-full">
    <h2 className="text-xl font-bold text-blue-700 mb-4">Available API Endpoints</h2>
    <ul className="space-y-6">
      <li>
        <strong>POST /api/login</strong>
        <div className="text-gray-700 text-xs sm:text-sm">
          Authenticate a user or organisation.<br />
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
        <strong>POST /api/fetch-user-data</strong>
        <div className="text-gray-700 text-xs sm:text-sm">
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
        <strong>POST /api/other-endpoint</strong>
        <div className="text-gray-700 text-xs sm:text-sm">
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
    <p className="mt-4 text-gray-700 text-xs sm:text-sm">
      <strong>Note:</strong> Always include your API key and the correct <code>type</code> for each request.
    </p>
  </div>
);

export default AvailableApi;
