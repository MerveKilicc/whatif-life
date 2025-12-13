"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatBarProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export default function StatBar({ label, value, icon: Icon, color }: StatBarProps) {
  return (
    <div className="flex flex-col gap-1 w-full max-w-[100px] md:max-w-[120px]">
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Icon size={12} />
        <span>{label}</span>
      </div>
      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, type: "spring" }}
          className="h-full absolute left-0 top-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
