"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSimulationStore } from "@/stores/simulationStore";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Coins, Activity, ArrowRight } from "lucide-react";
import StatBar from "@/components/simulation/StatBar";
import { continueSimulationAction } from "@/app/actions";

export default function SimulationPage() {
  const t = useTranslations("simulation");
  const locale = useLocale();
  const router = useRouter();
  const { currentChapter, stats, history, avatarData, birthData, setSimulationStart, addChapter } = useSimulationStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref to scroll to bottom on new content
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentChapter) {
      router.push(`/${locale}/input`);
    }
  }, [currentChapter, router, locale]);
  
  // Scroll to bottom when chapter changes
  useEffect(() => {
     if (bottomRef.current) {
         bottomRef.current.scrollIntoView({ behavior: 'smooth' });
     }
  }, [currentChapter]);

  const handleChoice = async (choiceText: string | null) => {
    console.log("handleChoice called:", choiceText); // Debug Log
    if (isLoading || !currentChapter) return;
    setIsLoading(true);

    const currentAge = currentChapter.age;
    
    try {
        console.log("Calling continueSimulationAction..."); // Debug Log
        const result = await continueSimulationAction(
            avatarData.name,
            currentAge,
            stats,
            choiceText,
            history
        );

        if (result.success && result.data) {
            console.log("New chapter received:", result.data); // Debug Log
            addChapter(result.data);
        } else {
            console.error("Simulation Action Failed:", result.error); // Debug Log
            alert("Something went wrong with the timeline...");
        }
    } catch (e) {
        console.error("Client Error:", e);
        alert("Connection lost to the multiverse.");
    } finally {
        setIsLoading(false);
    }
  };

  // Constants
  const MAX_CHAPTERS = 5;
  const isSimulationComplete = history.length >= MAX_CHAPTERS;

  return (
    <div className="min-h-screen bg-[#16213e] text-white flex flex-col items-center relative overflow-hidden">
      {/* Background Image */}
      <img 
        src="https://image.pollinations.ai/prompt/minimalist%20dark%20blue%20astrology%20chart%20texture%20zodiac%20constellations%20subtle%20elegant?width=1080&height=1920&nologo=true"
        alt="Simulation Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none"
      />

      {/* Top Bar - Stats */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#16213e]/90 backdrop-blur-md border-b border-gray-800 p-4 flex justify-center gap-4 shadow-lg">
        <StatBar label={t("happiness")} value={stats.happiness} icon={Heart} color="#ec4899" />
        <StatBar label={t("money")} value={stats.money} icon={Coins} color="#ffd700" />
        <StatBar label={t("health")} value={stats.health} icon={Activity} color="#22c55e" />
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-2xl px-6 pt-28 pb-32 flex flex-col gap-8 z-10">
        
        <motion.div
            key={currentChapter.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
        >
            <div className="flex items-baseline justify-between text-[#ffd700] font-serif border-b border-gray-700 pb-2 mb-2">
                <h1 className="text-2xl">{currentChapter.title}</h1>
                <span className="text-sm opacity-80">{currentChapter.period} (Age: {currentChapter.age})</span>
            </div>
            
            <p className="text-lg leading-relaxed text-gray-200 font-light whitespace-pre-line">
                {currentChapter.story_text}
            </p>

            {/* Stat Changes Feedback */}
            <div className="flex gap-4 text-xs mt-2 opacity-60">
                {Object.entries(currentChapter.stats_change).map(([key, val]) => (
                    val !== 0 && (
                        <span key={key} className={val > 0 ? "text-green-400" : "text-red-400"}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}: {val > 0 ? "+" : ""}{val}
                        </span>
                    )
                ))}
            </div>
        </motion.div>
        
        <div ref={bottomRef} />
      </div>

      {/* Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#16213e] via-[#16213e] to-transparent z-40 flex flex-col items-center">
        {isLoading ? (
            <div className="text-[#ffd700] animate-pulse font-serif">Kader çizgileri yeniden yazılıyor...</div>
        ) : (
            <div className="w-full max-w-lg flex flex-col gap-3">
                
                {/* Max Chapter Limit Reached - Force End */}
                {isSimulationComplete ? (
                    <button
                        onClick={() => router.push(`/${locale}/final`)}
                        className="w-full py-4 px-6 bg-[#ffd700] hover:bg-[#ffed4a] text-[#16213e] rounded-full font-bold text-lg transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(255,215,0,0.5)] flex items-center justify-center gap-2 animate-bounce"
                    >
                        {t("end_simulation_early") || "Hikayeyi Tamamla & Mektubu Oku"} <ArrowRight size={20} />
                    </button>
                ) : (
                    /* Normal Flow */
                    <>
                        {currentChapter.mini_choice ? (
                            <>
                                <p className="text-center text-[#ffd700] mb-2 font-medium">{currentChapter.mini_choice.question}</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {currentChapter.mini_choice.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleChoice(option)}
                                            className="w-full py-4 px-6 bg-[#533483] hover:bg-[#6b42a9] rounded-xl text-white font-medium transition-all transform hover:scale-[1.02] shadow-lg border border-[#ffffff10]"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => handleChoice(null)}
                                className="w-full py-4 px-6 bg-[#ffd700] hover:bg-[#ffed4a] text-[#16213e] rounded-full font-bold text-lg transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(255,215,0,0.3)] flex items-center justify-center gap-2"
                            >
                                {t("next_period")} <ArrowRight size={20} />
                            </button>
                        )}
                        
                        {/* Early Exit Option (only if not finished yet) */}
                        {history.length > 2 && (
                            <button
                                onClick={() => router.push(`/${locale}/final`)}
                                className="text-xs text-gray-400 hover:text-[#ffd700] underline mt-2"
                            >
                                {t("end_simulation_early") || "Bu Hikayeyi Sonlandır & Mektubu Oku"}
                            </button>
                        )}
                    </>
                )}
            </div>
        )}
      </div>

    </div>
  );
}
