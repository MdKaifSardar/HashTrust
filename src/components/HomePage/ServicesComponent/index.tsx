"use client";
import { motion } from "framer-motion";
import { SERVICES_CARDS } from "@/utils/data/HomePage/Services";
import { FiSearch, FiLink, FiShield, FiZap } from "react-icons/fi";

const ICONS: Record<string, React.ReactNode> = {
  FiSearch: <FiSearch size={36} className="mb-4 text-blue-700 dark:text-cyan-400 transition-colors" />,
  FiLink: <FiLink size={36} className="mb-4 text-blue-700 dark:text-cyan-400 transition-colors" />,
  FiShield: <FiShield size={36} className="mb-4 text-blue-700 dark:text-cyan-400 transition-colors" />,
  FiZap: <FiZap size={36} className="mb-4 text-blue-700 dark:text-cyan-400 transition-colors" />,
};

const boxStyle =
  "bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-100 dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90 dark:border dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-slate-950/40 p-6 flex flex-col items-center text-center transition-all duration-200 cursor-pointer";

const ServicesComponent = () => (
  <section id="services" className="py-16 px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 font-sans">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400">
        Our Services
      </span>
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
      {SERVICES_CARDS.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 8px 32px 0 rgba(34,197,246,0.18)",
          }}
          className={boxStyle}
        >
          <div className="text-4xl mb-4">{ICONS[card.icon]}</div>
          <div className="font-semibold text-lg text-blue-700 dark:text-cyan-300 mb-2 font-sans transition-colors">
            {card.title}
          </div>
          <div className="text-gray-600 dark:text-slate-400 text-sm font-sans transition-colors">
            {card.description}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default ServicesComponent;
