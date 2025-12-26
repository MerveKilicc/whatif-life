"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { NatalChart, calculateNatalChart } from "@/lib/astrology/calculator";
import { useSimulationStore } from "@/stores/simulationStore";
import { motion } from "framer-motion";

export default function ZodiacDisplay() {
  const t = useTranslations("zodiac");
  const { birthData } = useSimulationStore();

  const natalChart: NatalChart | null = useMemo(() => {
    // Only calculate if all birth data is available
    if (birthData.date && (birthData.time || birthData.isTimeUnknown) && birthData.place) {
      try {
        return calculateNatalChart(
          birthData.date,
          birthData.time,
          birthData.isTimeUnknown,
          birthData.place
        );
      } catch (error) {
        console.error("Error calculating natal chart:", error);
        return null;
      }
    }
    return null;
  }, [birthData]);

  if (!natalChart) {
    return null;
  }

  const chartItems = [
    { label: "Güneş", sign: natalChart.sun },
    { label: "Ay", sign: natalChart.moon },
    { label: "Yükselen", sign: natalChart.rising },
  ].filter(item => item.sign !== null); // Filter out Rising if unknown

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-4 w-full max-w-md text-center bg-[#16213e] p-6 rounded-lg border border-gray-700 shadow-lg mt-4"
    >
      <h3 className="text-xl font-serif text-[#ffd700]">{t("cosmic_identity_summary")}</h3>
      <div className="grid grid-cols-3 gap-4 text-gray-300">
        {chartItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-sm font-semibold">{item.label}</span>
            <span className="text-lg text-[#ffd700]">{t(item.sign.toLowerCase())}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
