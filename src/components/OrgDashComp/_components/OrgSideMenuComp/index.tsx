import React, { useEffect, useState } from "react";
import { ORG_SIDE_MENU } from "@/utils/data/OrgSideMenu";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Only open menu by default for desktop
      if (window.innerWidth < 768) setMenuOpen(false);
      else setMenuOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Only show toggle button and AnimatePresence for mobile */}
      {isMobile && (
        <>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ x: -256, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -256, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 z-[100] h-screen w-[70vw] max-w-xs bg-white border-r border-blue-100 shadow-lg"
              >
                <button
                  className="absolute top-6 -right-10 z-[102] bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <FiMenu size={24} />
                </button>
                <aside className="h-full w-full flex flex-col py-8 px-6">
                  <div className="mb-8">
                    <div className="text-xl font-bold text-blue-700">
                      {organisation.orgName}
                    </div>
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
              </motion.div>
            )}
            {!menuOpen && (
              <button
                className="fixed top-6 left-0 z-[102] bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <FiMenu size={24} />
              </button>
            )}
          </AnimatePresence>
          {/* Overlay for mobile menu */}
          {menuOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-[99]"
              onClick={() => setMenuOpen(false)}
            />
          )}
        </>
      )}
      {/* Always show fixed sidebar for desktop */}
      {!isMobile && (
        <div className="fixed bg-white top-0 left-0 z-[50] h-screen w-64 border-r border-blue-100 shadow-lg">
          <aside className="h-full w-full flex flex-col py-[5rem] px-6">
            <div className="mb-8">
              <div className="text-xl font-bold text-blue-700">
                {organisation.orgName}
              </div>
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
        </div>
      )}
    </>
  );
};

export default OrgSideMenuComp;
