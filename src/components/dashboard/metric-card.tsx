"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string;
  badge: string;
  icon: ReactNode;
  danger?: boolean;
  success?: boolean;
}

export default function MetricCard({
  title,
  value,
  badge,
  icon,
  danger,
  success,
}: MetricCardProps) {
  // Border accent for card
  const borderTone = danger
    ? "border-rose-400/40"
    : success
      ? "border-emerald-400/30"
      : "border-white/10";

  // Badge styling
  const badgeTone = danger
    ? "bg-rose-500/10 text-[#FFB4AB] border-rose-500/30"
    : success
      ? "bg-emerald-500/10 text-[#4DE082] border-emerald-500/30"
      : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";

  // Match icon container accent to metric state
  const iconTone = danger
    ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
    : success
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`rounded-2xl border ${borderTone} bg-[#0F172A] p-5 backdrop-blur-md shadow-xl transition-colors`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </h2>

          <span
            className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${badgeTone}`}
          >
            {badge}
          </span>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconTone}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}