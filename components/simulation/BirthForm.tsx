"use client";

import { useSimulationStore } from "@/stores/simulationStore";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function BirthForm() {
  const t = useTranslations("input");
  const { birthData, setBirthData } = useSimulationStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6 w-full max-w-md"
    >
      <h2 className="text-2xl font-serif text-[#ffd700] mb-4">{t("step_1_title")}</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">{t("birthdate")}</label>
        <input
          type="date"
          value={birthData.date}
          onChange={(e) => setBirthData({ date: e.target.value })}
          className="bg-[#16213e] border border-gray-600 rounded-lg p-3 text-white focus:border-[#ffd700] outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">{t("birthtime")}</label>
        <div className="flex gap-4 items-center">
          <input
            type="time"
            disabled={birthData.isTimeUnknown}
            value={birthData.time}
            onChange={(e) => setBirthData({ time: e.target.value })}
            className="bg-[#16213e] border border-gray-600 rounded-lg p-3 text-white focus:border-[#ffd700] outline-none flex-1 disabled:opacity-50"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={birthData.isTimeUnknown}
              onChange={(e) => setBirthData({ isTimeUnknown: e.target.checked })}
              className="w-4 h-4 accent-[#ffd700]"
            />
            <span className="text-sm text-gray-400 select-none">{t("unknown_time")}</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">{t("birthplace")}</label>
        <input
          type="text"
          value={birthData.place}
          onChange={(e) => setBirthData({ place: e.target.value })}
          placeholder="İstanbul, Türkiye"
          className="bg-[#16213e] border border-gray-600 rounded-lg p-3 text-white focus:border-[#ffd700] outline-none"
        />
      </div>
    </motion.div>
  );
}
