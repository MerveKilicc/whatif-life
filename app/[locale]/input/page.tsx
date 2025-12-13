"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import BirthForm from "@/components/simulation/BirthForm";
import AvatarForm from "@/components/simulation/AvatarForm";
import ChoiceForm from "@/components/simulation/ChoiceForm";
import { useSimulationStore } from "@/stores/simulationStore";

export default function InputPage() {
  const t = useTranslations("input");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { birthData, avatarData, choiceData } = useSimulationStore();

  const handleNext = () => {
    if (step === 1 && (!birthData.date || (!birthData.time && !birthData.isTimeUnknown) || !birthData.place)) {
      alert("Lütfen tüm alanları doldurun."); // Basic validation
      return;
    }
    if (step === 2 && !avatarData.name) {
      alert("Lütfen bir isim girin.");
      return;
    }

    if (step === 3 && !choiceData.text.trim()) {
      alert("Lütfen seçiminizi yazın.");
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push("/loading");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#1a1a2e]">
       {/* Background */}
       <div className="absolute inset-0 bg-gradient-to-b from-[#2a3b5e] to-[#16213e] z-0 pointer-events-none" />
       
       <div className="z-10 w-full max-w-md flex flex-col gap-8">
         {/* Progress Bar */}
         <div className="flex gap-2 w-full mb-8">
           {[1, 2, 3].map((s) => (
             <div 
               key={s} 
               className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                 s <= step ? "bg-[#ffd700]" : "bg-gray-700"
               }`}
             />
           ))}
         </div>

         <AnimatePresence mode="wait">
            {step === 1 && <BirthForm key="step1" />}
            {step === 2 && <AvatarForm key="step2" />}
            {step === 3 && <ChoiceForm key="step3" />}
         </AnimatePresence>

         <div className="flex gap-4 mt-8">
           <button
             onClick={handleBack}
             className="flex-1 py-3 px-6 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
           >
             {t("back")}
           </button>
           <button
             onClick={handleNext}
             className="flex-1 py-3 px-6 rounded-lg bg-[#533483] text-white hover:bg-[#6b42a9] transition-colors font-semibold shadow-lg shadow-[#533483]/30"
           >
             {step === 3 ? t("submit") : t("next")}
           </button>
         </div>
       </div>
    </main>
  );
}