import React from "react";
import { ORG_SIDE_MENU } from "@/utils/data/OrgSideMenu";

interface OrgSideMenuCompProps {
  organisation: {
    orgName: string;
    apiKey?: string;
    traffic?: string;
  };
  selected: string;
  setSelected: (v: string) => void;
}

const OrgSideMenuComp: React.FC<OrgSideMenuCompProps> = ({
  organisation,
  selected,
  setSelected,
}) => {
  return (
    <aside className="bg-white border-r border-blue-100 min-h-screen w-64 flex flex-col py-8 px-6">
      <div className="mb-8">
        <div className="text-xl font-bold text-blue-700">{organisation.orgName}</div>
        {organisation.apiKey && (
          <div className="text-xs text-gray-500 mt-1">
            API Key: <span className="font-mono text-blue-600">{organisation.apiKey}</span>
          </div>
        )}
        {organisation.traffic && (
          <div className="text-xs text-gray-500 mt-1">
            Traffic: <span className="font-semibold">{organisation.traffic}</span>
          </div>
        )}
      </div>
      <nav className="flex flex-col gap-2">
        {ORG_SIDE_MENU.map((item) => (
          <button
            key={item.label}
            className={`text-left px-4 py-2 rounded font-semibold transition ${
              selected === item.label
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => setSelected(item.label)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default OrgSideMenuComp;
