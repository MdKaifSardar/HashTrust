"use client";
import { motion } from "framer-motion";

const services = [
	{
		title: "Identity Verification",
		description:
			"Seamlessly verify user identities using AI-powered document and face analysis.",
		icon: "🔍",
	},
	{
		title: "Blockchain Anchoring",
		description:
			"Anchor user data hashes on the blockchain for tamper-proof, auditable records.",
		icon: "⛓️",
	},
	{
		title: "Privacy Protection",
		description:
			"User data is never stored on-chain. Only cryptographic hashes are anchored, ensuring privacy.",
		icon: "🛡️",
	},
	{
		title: "Fast Onboarding",
		description:
			"Get verified and onboarded in minutes with a smooth, modern user experience.",
		icon: "⚡",
	},
];

const boxStyle =
	"bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-100 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-0 hover:shadow-2xl transition-all duration-200 cursor-pointer";

const ServicesComponent = () => (
	<section className="py-16 px-4">
		<h2 className="text-3xl md:text-4xl font-bold text-center mb-10 font-sans">
			<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400">
				Our Services
			</span>
		</h2>
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
			{services.map((service, idx) => (
				<motion.div
					key={service.title}
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
					<div className="text-4xl mb-4">{service.icon}</div>
					<div className="font-semibold text-lg text-blue-700 mb-2 font-sans">
						{service.title}
					</div>
					<div className="text-gray-600 text-sm font-sans">
						{service.description}
					</div>
				</motion.div>
			))}
		</div>
	</section>
);

export default ServicesComponent;
