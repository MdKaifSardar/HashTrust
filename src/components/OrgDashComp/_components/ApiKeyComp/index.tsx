"use client";

import React, { useState } from "react";
import CreateApiKeys from "./_components/CreateApiKeys";
import DisplayApiKeys from "./_components/DisaplyApiKeys";
import AvailableApi from "./_components/AvailableApi";
import { FiKey } from "react-icons/fi";

export const ApiKeyComp: React.FC<{ organisationUid?: string }> = ({
  organisationUid,
}) => {
  const [refresh, setRefresh] = useState(false);

  const handleCreated = () => setRefresh((r) => !r);

  return (
    <div className="w-full space-y-8">

      {/* Header & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <FiKey size={16} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              API Key Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Generate and manage your secret credentials for server-side verification integration.
          </p>
        </div>

        <div>
          <CreateApiKeys
            organisationUid={organisationUid}
            onCreated={handleCreated}
          />
        </div>
      </div>

      {/* Display Active Keys */}
      <DisplayApiKeys organisationUid={organisationUid} refresh={refresh} />

      {/* Available API Endpoints Preview */}
      <div className="mt-8">
        <AvailableApi />
      </div>
    </div>
  );
};

export default ApiKeyComp;
