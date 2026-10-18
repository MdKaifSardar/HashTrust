import React from "react";

interface OrgDetailsProps {
  organisation: {
    orgName: string;
    email: string;
    contactPerson: string;
    createdAt?: string;
    apiKey?: string;
    traffic?: string;
    // Add more fields as needed
  };
}

const OrgDetailsComp: React.FC<OrgDetailsProps> = ({ organisation }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-blue-100 dark:border-slate-800 shadow-sm w-full h-full transition-colors">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-cyan-400 mb-4 transition-colors">Organisation Details</h2>
      <div className="space-y-3">
        <div>
          <span className="font-semibold text-gray-700 dark:text-slate-300">Name:</span>{" "}
          <span className="text-gray-800 dark:text-slate-100">{organisation.orgName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700 dark:text-slate-300">Email:</span>{" "}
          <span className="text-gray-800 dark:text-slate-100">{organisation.email}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700 dark:text-slate-300">Contact Person:</span>{" "}
          <span className="text-gray-800 dark:text-slate-100">{organisation.contactPerson}</span>
        </div>
        {organisation.apiKey && (
          <div>
            <span className="font-semibold text-gray-700 dark:text-slate-300">API Key:</span>{" "}
            <span className="font-mono text-blue-600 dark:text-cyan-400 select-all">{organisation.apiKey}</span>
          </div>
        )}
        {organisation.traffic && (
          <div>
            <span className="font-semibold text-gray-700 dark:text-slate-300">Traffic:</span>{" "}
            <span className="text-gray-800 dark:text-slate-100">{organisation.traffic}</span>
          </div>
        )}
        {organisation.createdAt && (
          <div>
            <span className="font-semibold text-gray-700 dark:text-slate-300">Created At:</span>{" "}
            <span className="text-gray-800 dark:text-slate-100">{new Date(organisation.createdAt).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgDetailsComp;
