"use client";

import React, { useEffect, useState } from "react";
import {
  getApiKeysForOrg,
  getApiKeyUsageData,
} from "@/lib/actions/apikey.actions";
import { toast } from "react-toastify";
import LogsComp from "./_components/LogsComp";
import UsageLineChart from "./_components/LineChart";
import UsageBarChart from "./_components/BarChart";
import UsagePieChart from "./_components/PieChart";

const UsageComp: React.FC<{ organisationUid?: string }> = ({
  organisationUid,
}) => {
  const [usageData, setUsageData] = useState<
    Array<{ time: string; count: number; types: string[]; rawTypes: string[] }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const fetchUsage = async () => {
    setLoading(true);
    try {
      // Get session cookie from browser
      const sessionCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session="))
        ?.split("=")[1];
      if (!sessionCookie) {
        toast.error("Not authenticated.");
        setUsageData([]);
        setLoading(false);
        return;
      }
      if (!organisationUid) {
        toast.error("Organisation ID is missing.");
        setUsageData([]);
        setLoading(false);
        return;
      }
      // Get API keys for org using session cookie
      const apiKeysRes = await getApiKeysForOrg({ sessionCookie, organisationUid });
      if (!apiKeysRes.ok) {
        toast.error(apiKeysRes.message || "Failed to fetch API Keys.");
        setUsageData([]);
        setLoading(false);
        return;
      }
      if (!apiKeysRes.apiKeys || apiKeysRes.apiKeys.length === 0) {
        toast.error(
          apiKeysRes.message || "No API Keys found for this organisation."
        );
        setUsageData([]);
        setLoading(false);
        return;
      }
      // Only one API key per org
      const apiKey = apiKeysRes.apiKeys[0].apiKey;
      const usageRes = await getApiKeyUsageData(apiKey);
      if (!usageRes.ok) {
        toast.error(usageRes.message || "Failed to fetch usage data.");
        setUsageData([]);
        setLoading(false);
        return;
      }
      if (!usageRes.usageLog || usageRes.usageLog.length === 0) {
        // Only show error if there is a real error message, not just "no data"
        if (usageRes.message && usageRes.message !== "API Key not found.") {
          toast.error(usageRes.message);
        }
        setUsageData([]);
        setLoading(false);
        return;
      }
      // Group by timestamp (to the second)
      const grouped: {
        [key: string]: { count: number; types: string[]; rawTypes: string[] };
      } = {};
      const typeSet = new Set<string>();
      usageRes.usageLog.forEach((entry: any) => {
        const d = new Date(entry.time);
        // Format to local string with seconds
        const timeStr = d.toLocaleString();
        const type = entry.type || "";
        typeSet.add(type);
        if (!grouped[timeStr]) {
          grouped[timeStr] = { count: 0, types: [], rawTypes: [] };
        }
        grouped[timeStr].count += 1;
        grouped[timeStr].types.push(type);
        grouped[timeStr].rawTypes.push(type);
      });
      const chartData = Object.entries(grouped)
        .map(([time, { count, types, rawTypes }]) => ({
          time,
          count,
          types,
          rawTypes,
        }))
        .sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
      setUsageData(chartData);
      setAllTypes(Array.from(typeSet));
      // Save logs for display
      setLogs(usageRes.usageLog || []);
    } catch (err: any) {
      toast.error("Failed to fetch usage data.");
      setUsageData([]);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organisationUid]);

  // Filter usage data by type
  const filteredData =
    typeFilter === "All"
      ? usageData
      : usageData
          .map((d) => {
            // Only count requests of the selected type at this time
            const filteredTypes = d.rawTypes.filter((t) => t === typeFilter);
            return filteredTypes.length
              ? {
                  ...d,
                  count: filteredTypes.length,
                  types: filteredTypes,
                }
              : null;
          })
          .filter(Boolean);

  // Prepare bar chart data: frequency of each type
  const typeFrequency: { type: string; count: number }[] = [];
  if (usageData.length > 0) {
    const freq: { [type: string]: number } = {};
    usageData.forEach((d) => {
      d.rawTypes.forEach((t) => {
        freq[t] = (freq[t] || 0) + 1;
      });
    });
    Object.entries(freq).forEach(([type, count]) => {
      typeFrequency.push({ type, count });
    });
  }

  // Prepare pie chart data: distribution of types
  const pieData = typeFrequency.map((d) => ({
    name: d.type,
    value: d.count,
  }));

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-100 shadow-sm w-full h-fit flex flex-col justify-start items-center">
      <div className="flex w-full justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-700">API Key Usage</h2>
        <button
          onClick={fetchUsage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-1 rounded font-semibold shadow hover:bg-blue-700 transition"
        >
          {loading ? "Reloading..." : "Reload"}
        </button>
      </div>
      <div className="w-full flex flex-col md:flex-row gap-4 mb-6 items-center">
        <label className="font-semibold text-blue-700">
          Filter by Request Type:
        </label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-blue-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="All">All</option>
          {allTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-blue-600">Loading usage data...</div>
      ) : filteredData.length === 0 ? (
        <div className="font-semibold text-gray-800 text-lg">
          No usage data available.
        </div>
      ) : (
        <>
          <UsageLineChart data={filteredData} />
          <UsageBarChart data={typeFrequency} typeFilter={typeFilter} />
          <UsagePieChart data={typeFrequency} typeFilter={typeFilter} />
          <LogsComp logs={logs} />
        </>
      )}
    </div>
  );
};

export default UsageComp;