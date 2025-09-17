"use client";
import { motion } from "framer-motion";

const features = [
	{
		title: "Immutable Records",
		description:
			"Every verification is anchored on the blockchain, ensuring tamper-proof and auditable records.",
		icon: "📝",
	},
	{
		title: "AI-Powered Extraction",
		description:
			"Advanced AI extracts and validates identity data from documents and selfies in real time.",
		icon: "🤖",
	},
	{
		title: "User-Centric Privacy",
		description:
			"Only cryptographic hashes are stored on-chain. Your personal data remains private and secure.",
		icon: "🔒",
	},
	{
		title: "Real-Time Verification",
		description:
			"Instant feedback and onboarding with a seamless, modern user experience.",
		icon: "⏱️",
	},
];

const boxStyle =
	"bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-100 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-0 hover:shadow-2xl transition-all duration-200 cursor-pointer";

const UniqueFeaturesComp = () => (
	<section className="py-16 px-4">
		<h2 className="text-3xl md:text-4xl font-bold text-center mb-10 font-sans">
			<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400">
				Unique Features
			</span>
		</h2>
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
			{features.map((feature, idx) => (
				<motion.div
					key={feature.title}
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
					<div className="text-4xl mb-4">{feature.icon}</div>
					<div className="font-semibold text-lg text-blue-700 mb-2 font-sans">
						{feature.title}
					</div>
					<div className="text-gray-600 text-sm font-sans">
						{feature.description}
					</div>
				</motion.div>
			))}
		</div>
	</section>
);

export default UniqueFeaturesComp;
