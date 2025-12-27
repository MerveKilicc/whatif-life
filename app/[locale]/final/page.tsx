"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSimulationStore } from "@/stores/simulationStore";
import { generateFinalLetterAction } from "@/app/actions";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
// import download from 'downloadjs'; // Removed top-level import
import ShareCard from "@/components/simulation/ShareCard";
import { Download, Share2 } from "lucide-react";

export default function FinalPage() {
  const t = useTranslations("final");
  const locale = useLocale();
  const router = useRouter();
  const { avatarData, birthData, history, stats, reset } = useSimulationStore();
  const [letter, setLetter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  const cardRef = useRef<HTMLDivElement>(null); // Still need this for ShareCard prop but not for download

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

  const handleDownloadLetter = useCallback(async () => {
    if (letter) {
      const download = await import('downloadjs'); // Dynamic import here
      download.default(letter, 'whatif-life-letter.txt', 'text/plain');
    }
  }, [letter]);

  return (
    <div className="min-h-screen bg-[#16213e] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
       {/* Background Image */}
       <img 
         src="https://image.pollinations.ai/prompt/vintage%20mysterious%20library%20desk%20with%20celestial%20maps%20and%20candles%20dark%20mood%20cinematic?width=1080&height=1920&nologo=true"
         alt="Final Background"
         className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
       />
       
       <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      {loading ? (
        <div className="flex flex-col items-center gap-4 z-10">
            <div className="w-16 h-16 border-4 border-t-[#ffd700] border-r-transparent border-b-[#ffd700] border-l-transparent rounded-full animate-spin" />
            <p className="font-serif text-[#ffd700] animate-pulse">Kozmik mektup yazılıyor...</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 items-start z-10 w-full max-w-5xl">
            
            {/* Letter Section */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 w-full bg-[#fffaf0] text-gray-900 p-8 md:p-12 rounded-sm shadow-2xl relative"
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
                <div className="mt-8 flex justify-center gap-4">
                    <button 
                        onClick={handleReset}
                        className="px-6 py-3 bg-[#16213e] text-white font-sans font-bold rounded hover:bg-[#2a3b5e] transition-colors"
                    >
                        {t("new_simulation")}
                    </button>
                    <button 
                        onClick={handleDownloadLetter}
                        className="px-6 py-3 bg-[#ffd700] text-[#16213e] font-sans font-bold rounded hover:bg-[#ffed4a] transition-colors flex items-center gap-2"
                    >
                        <Download size={20} /> Mektubu İndir
                    </button>
                </div>
            </motion.div>

            {/* Share Card Section - No Download Button Here */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4 items-center w-full md:w-auto"
            >
                <div className="bg-black/30 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                    <ShareCard ref={cardRef} />
                </div>
            </motion.div>

        </div>
      )}
    </div>
  );
}
