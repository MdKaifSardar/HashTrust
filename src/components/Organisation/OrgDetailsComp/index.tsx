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
    <div className="bg-white p-8 rounded-lg border border-blue-100 shadow-sm max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Organisation Details</h2>
      <div className="space-y-3">
        <div>
          <span className="font-semibold text-gray-700">Name:</span>{" "}
          <span className="text-gray-800">{organisation.orgName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Email:</span>{" "}
          <span className="text-gray-800">{organisation.email}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Contact Person:</span>{" "}
          <span className="text-gray-800">{organisation.contactPerson}</span>
        </div>
        {organisation.apiKey && (
          <div>
            <span className="font-semibold text-gray-700">API Key:</span>{" "}
            <span className="font-mono text-blue-600">{organisation.apiKey}</span>
          </div>
        )}
        {organisation.traffic && (
          <div>
            <span className="font-semibold text-gray-700">Traffic:</span>{" "}
            <span className="text-gray-800">{organisation.traffic}</span>
          </div>
        )}
        {organisation.createdAt && (
          <div>
            <span className="font-semibold text-gray-700">Created At:</span>{" "}
            <span className="text-gray-800">{new Date(organisation.createdAt).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgDetailsComp;
