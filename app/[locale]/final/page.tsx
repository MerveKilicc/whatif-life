"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSimulationStore } from "@/stores/simulationStore";
import { generateFinalLetterAction } from "@/app/actions";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalPage() {
  const t = useTranslations("final");
  const locale = useLocale();
  const router = useRouter();
  const { avatarData, birthData, history, stats, reset } = useSimulationStore();
  const [letter, setLetter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (history.length === 0) {
      router.push("/");
      return;
    }

    async function fetchLetter() {
      const birthYear = new Date(birthData.date).getFullYear();
      const result = await generateFinalLetterAction(
        avatarData.name,
        birthYear,
        history,
        stats
      );

      if (result.success && result.data) {
        setLetter(result.data);
      } else {
        setLetter("The stars are silent... (Error generating letter)");
      }
      setLoading(false);
    }

    fetchLetter();
  }, [avatarData, birthData, history, stats, router]);

  const handleReset = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#16213e] text-white flex flex-col items-center justify-center p-6 relative">
       {/* Background */}
       <div className="absolute inset-0 bg-gradient-radial from-[#2a3b5e] to-[#16213e] pointer-events-none" />
       <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      {loading ? (
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-t-[#ffd700] border-r-transparent border-b-[#ffd700] border-l-transparent rounded-full animate-spin" />
            <p className="font-serif text-[#ffd700] animate-pulse">Kozmik mektup yazılıyor...</p>
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#fffaf0] text-gray-900 p-8 md:p-12 rounded-sm shadow-2xl relative"
            style={{ 
                fontFamily: '"Courier Prime", "Courier New", monospace',
                backgroundImage: 'linear-gradient(#eee .1rem, transparent .1rem)',
                backgroundSize: '100% 1.2rem'
            }}
        >
            <div className="absolute top-0 left-0 w-full h-2 bg-[#ffd700]" />
            
            <h1 className="text-3xl font-serif text-center mb-8 font-bold text-[#16213e]">{t("letter_title")}</h1>
            
            <div className="whitespace-pre-line text-lg leading-[1.2rem]">
                {letter}
            </div>

            <div className="mt-12 flex flex-col gap-4 text-center">
                <p className="text-sm text-gray-500 italic">WhatIf.life</p>
                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={handleReset}
                        className="px-6 py-3 bg-[#16213e] text-white font-sans font-bold rounded hover:bg-[#2a3b5e] transition-colors"
                    >
                        {t("new_simulation")}
                    </button>
                </div>
            </div>
        </motion.div>
      )}
    </div>
  );
}
