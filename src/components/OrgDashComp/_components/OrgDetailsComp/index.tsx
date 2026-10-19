"use client";

import React from "react";
import { FiBriefcase, FiMail, FiUser, FiCalendar, FiActivity, FiKey, FiShield, FiExternalLink } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import MetricCard from "@/components/ui/Card";

interface OrgDetailsProps {
  organisation: {
    orgName: string;
    email: string;
    contactPerson: string;
    createdAt?: string;
    apiKey?: string;
    traffic?: string;
  };
}

export const OrgDetailsComp: React.FC<OrgDetailsProps> = ({ organisation }) => {
  return (
    <div className="w-full space-y-8">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Enterprise Console
            </h1>
            <Badge variant="verified" size="md">
              Enterprise Tier
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time identity verification metrics and API credentials.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total API Calls</span>
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-500">
              <FiActivity size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {organisation.traffic || "0"}
          </div>
          <span className="text-[11px] text-emerald-500 font-semibold mt-1 inline-block">
            +12.4% from last week
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Verification SLA</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500">
              <FiShield size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            99.98%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            Sub-second response
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Security Engine</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
              <FiKey size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            Passive v2
          </div>
          <span className="text-[11px] text-sky-500 font-semibold mt-1 inline-block">
            Anti-spoofing Active
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Blockchain Network</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500">
              <FiShield size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            Sepolia
          </div>
          <span className="text-[11px] text-emerald-500 font-semibold mt-1 inline-block">
            Synced
          </span>
        </div>
      </div>

      {/* Account Details Card */}
      <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Organisation Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 mb-1">
              <FiBriefcase size={14} /> Legal Organisation Name
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {organisation.orgName}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 mb-1">
              <FiMail size={14} /> Contact Email Address
            </span>
            <p className="text-sm font-mono font-medium text-slate-900 dark:text-white">
              {organisation.email}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 mb-1">
              <FiUser size={14} /> Account Administrator
            </span>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {organisation.contactPerson}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 mb-1">
              <FiCalendar size={14} /> Member Since
            </span>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {organisation.createdAt ? new Date(organisation.createdAt).toLocaleDateString() : "Active"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgDetailsComp;
