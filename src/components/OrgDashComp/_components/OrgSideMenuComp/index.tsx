"use client";

import React, { useEffect, useState } from "react";
import { ORG_SIDE_MENU } from "@/utils/data/OrgSideMenu";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX, FiBriefcase, FiKey, FiActivity, FiBookOpen, FiSettings } from "react-icons/fi";
import ThemeToggle from "@/components/ThemeToggle";

interface OrgSideMenuCompProps {
  organisation: {
    orgName: string;
    apiKey?: string;
    traffic?: string;
  };
  selected: string;
  setSelected: (v: string) => void;
}

const MENU_ICONS: Record<string, React.ReactNode> = {
  Details: <FiBriefcase size={16} />,
  "API Key": <FiKey size={16} />,
  Traffic: <FiActivity size={16} />,
  "API Documentation": <FiBookOpen size={16} />,
  Settings: <FiSettings size={16} />,
};

export const OrgSideMenuComp: React.FC<OrgSideMenuCompProps> = ({
  organisation,
  selected,
  setSelected,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setMenuOpen(false);
      else setMenuOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile && (
        <>
          <AnimatePresence>
            {menuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
                  onClick={() => setMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: -260 }}
                  animate={{ x: 0 }}
                  exit={{ x: -260 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed top-0 left-0 z-[900] h-screen w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/10 shadow-2xl flex flex-col justify-between p-6"
                >
                  <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <FiBriefcase size={16} />
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[150px]">
                        {organisation.orgName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMenuOpen(false)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <nav className="flex flex-col gap-1.5 py-6 flex-1">
                    {ORG_SIDE_MENU.map((item) => {
                      const isActive = selected === item.label;
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            setSelected(item.label);
                            setMenuOpen(false);
                          }}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                          }`}
                        >
                          {MENU_ICONS[item.label] || <FiBriefcase size={16} />}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Theme</span>
                    <ThemeToggle />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {!menuOpen && (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="fixed bottom-6 right-6 z-[100] p-3.5 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all"
              aria-label="Open sidebar menu"
            >
              <FiMenu size={22} />
            </button>
          )}
        </>
      )}

      {/* Desktop Fixed Sidebar */}
      {!isMobile && (
        <aside className="w-64 fixed top-16 bottom-0 left-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200/80 dark:border-white/10 p-5 flex flex-col justify-between z-40 transition-colors">
          <div>
            {/* Org Profile Header */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-sky-400 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                {organisation.orgName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {organisation.orgName}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verified Enterprise
                </p>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="flex flex-col gap-1">
              {ORG_SIDE_MENU.map((item) => {
                const isActive = selected === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setSelected(item.label)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    {MENU_ICONS[item.label] || <FiBriefcase size={16} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Dark Mode</span>
            <ThemeToggle />
          </div>
        </aside>
      )}
    </>
  );
};

export default OrgSideMenuComp;