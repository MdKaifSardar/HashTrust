import React from "react";

const SettingsComp: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-blue-100 dark:border-slate-800 shadow-sm w-full h-full flex flex-col justify-center items-center transition-colors">
    <h2 className="text-xl font-bold text-blue-700 dark:text-cyan-400 mb-4 transition-colors">Settings</h2>
    <div className="text-gray-600 dark:text-slate-400">Settings options go here.</div>
  </div>
);

export default SettingsComp;
