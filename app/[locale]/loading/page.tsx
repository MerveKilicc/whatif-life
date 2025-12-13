"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSimulationStore } from "@/stores/simulationStore";
import { calculateNatalChart } from "@/lib/astrology/calculator";
import { startSimulationAction } from "@/app/actions";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

export default function LoadingPage() {
  const t = useTranslations("loading");
  const locale = useLocale();
  const router = useRouter();
  const { birthData, avatarData, choiceData, setSimulationStart } = useSimulationStore();
  const [statusMessage, setStatusMessage] = useState(t("messages.0"));

  useEffect(() => {
    let isMounted = true;

    async function init() {
      // 1. Calculate Chart locally
      const chart = calculateNatalChart(
        birthData.date,
        birthData.time,
        birthData.isTimeUnknown,
        birthData.place
      );

      // Animation steps
      if (!isMounted) return;
      setStatusMessage(t("messages.1"));
      await new Promise((r) => setTimeout(r, 1500));

      if (!isMounted) return;
      setStatusMessage(t("messages.2"));
      await new Promise((r) => setTimeout(r, 1500));

      // 2. Call AI
      if (!isMounted) return;
      setStatusMessage(t("messages.3"));
      
      const birthYear = new Date(birthData.date).getFullYear();
      
      try {
        const result = await startSimulationAction(
          avatarData.name,
          birthYear,
          chart,
          choiceData
        );

        if (result.success && result.data) {
           setSimulationStart(result.data);
           router.push(`/${locale}/simulation`);
        } else {
           // Handle Error
           alert("Simulation failed. Please try again.");
           router.push(`/${locale}/input`);
        }

      } catch (error) {
        console.error(error);
        alert("An error occurred.");
        router.push(`/${locale}/input`);
      }
    }

    if (birthData.date) {
        init();
    } else {
        router.push(`/${locale}/input`);
    }

    return () => { isMounted = false; };
  }, [birthData, avatarData, choiceData, router, setSimulationStart, t, locale]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#16213e] text-white p-8 text-center relative overflow-hidden">
      {/* Background stars (simple CSS/SVG) */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"/>
          <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-75"/>
          <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white rounded-full animate-pulse delay-150"/>
      </div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        className="w-32 h-32 border-4 border-dashed border-[#ffd700] rounded-full mb-8 relative"
      >
        <div className="absolute inset-2 border-2 border-[#533483] rounded-full opacity-50" />
      </motion.div>

      <motion.h2
        key={statusMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-2xl font-serif text-[#ffd700]"
      >
        {statusMessage}
      </motion.h2>
    </div>
  );
}
