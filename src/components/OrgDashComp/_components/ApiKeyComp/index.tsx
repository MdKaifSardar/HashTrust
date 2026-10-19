"use client";
import React, { useState } from "react";
import CreateApiKeys from "./_components/CreateApiKeys";
import DisplayApiKeys from "./_components/DisaplyApiKeys";
import AvailableApi from "./_components/AvailableApi";
import { ToastContainer } from "react-toastify";

const ApiKeyComp: React.FC<{ organisationUid?: string }> = ({
  organisationUid,
}) => {
  const [refresh, setRefresh] = useState(false);

  // Trigger refresh for DisplayApiKeys after creating a new key
  const handleCreated = () => setRefresh((r) => !r);

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-lg border border-blue-100 dark:border-slate-800 shadow-sm w-full h-full transition-colors">
      <ToastContainer />
      <h2 className="text-xl font-bold text-blue-700 dark:text-cyan-400 mb-4 transition-colors">
        API Key Management
      </h2>
      <CreateApiKeys
        organisationUid={organisationUid}
        onCreated={handleCreated}
      />
      <DisplayApiKeys organisationUid={organisationUid} refresh={refresh} />
      <AvailableApi />
    </div>
  );
};

export default ApiKeyComp;
