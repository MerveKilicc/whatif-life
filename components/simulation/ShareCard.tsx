"use client";

import { useSimulationStore } from "@/stores/simulationStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Heart, Coins, Activity } from "lucide-react";
import { forwardRef, useState, useEffect, useMemo } from "react";
import { calculateNatalChart } from "@/lib/astrology/calculator";

// Using forwardRef to allow capturing this component as an image
const ShareCard = forwardRef<HTMLDivElement>((props, ref) => {
  const t = useTranslations();
  const { avatarData, birthData, stats, generatedAvatarUrl } = useSimulationStore();
  
  // Recalculate chart for display
  const chart = birthData.date && birthData.place 
    ? calculateNatalChart(birthData.date, birthData.time, birthData.isTimeUnknown, birthData.place)
    : null;

  // Use stored URL or fallback to new construction
  const activeAvatarUrl = useMemo(() => {
    if (generatedAvatarUrl) return generatedAvatarUrl;
    
    if (!avatarData.gender) return null;
    const prompt = `realistic portrait of a ${avatarData.gender} person, ${avatarData.hairStyle} ${avatarData.hairColor} hair, ${avatarData.skinTone} skin tone, neutral expression, looking at camera, cinematic lighting, 8k resolution, detailed texture, digital art style`;
    const seed = avatarData.name.length * 123; 
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${seed}`;
  }, [avatarData, generatedAvatarUrl]);

  return (
    <div ref={ref} className="w-[350px] bg-[#16213e] text-white p-6 rounded-xl border-4 border-[#ffd700] shadow-2xl flex flex-col gap-6 relative overflow-hidden font-sans">
      {/* Background Texture */}
      <img 
        src="https://image.pollinations.ai/prompt/minimalist%20dark%20blue%20astrology%20chart%20texture%20zodiac%20constellations%20subtle%20elegant?width=512&height=800&nologo=true"
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        crossOrigin="anonymous"
      />
      
      {/* Header */}
      <div className="z-10 text-center border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-serif text-[#ffd700] tracking-wider">WhatIf.life</h2>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Paralel Evren Raporu</p>
      </div>

      {/* Avatar & Name */}
      <div className="z-10 flex items-center gap-4">
        <div className="w-20 h-20 shrink-0 border-2 border-[#ffd700] rounded-full overflow-hidden bg-black">
          {activeAvatarUrl ? (
            <img 
              src={activeAvatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
             <div className="w-full h-full bg-gray-800 animate-pulse" />
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">{avatarData.name}</h3>
          <p className="text-sm text-gray-400">Alternatif Benlik</p>
        </div>
      </div>

      {/* Zodiac Stats */}
      {chart && (
        <div className="z-10 grid grid-cols-3 gap-2 bg-[#0f1526]/50 p-3 rounded-lg border border-gray-700">
            <div className="text-center">
                <span className="block text-[10px] text-gray-400">GÜNEŞ</span>
                <span className="text-[#ffd700] font-serif">{t(`zodiac.${chart.sun.toLowerCase()}`)}</span>
            </div>
            <div className="text-center border-l border-gray-700">
                <span className="block text-[10px] text-gray-400">AY</span>
                <span className="text-[#ffd700] font-serif">{t(`zodiac.${chart.moon.toLowerCase()}`)}</span>
            </div>
            <div className="text-center border-l border-gray-700">
                <span className="block text-[10px] text-gray-400">YÜKSELEN</span>
                <span className="text-[#ffd700] font-serif">{chart.rising ? t(`zodiac.${chart.rising.toLowerCase()}`) : "-"}</span>
            </div>
        </div>
      )}

      {/* Life Stats */}
      <div className="z-10 space-y-3">
        <div className="flex items-center gap-3">
            <Heart size={16} className="text-pink-500" />
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div style={{ width: `${stats.happiness}%` }} className="h-full bg-pink-500" />
            </div>
            <span className="text-xs w-6 text-right">{stats.happiness}</span>
        </div>
        <div className="flex items-center gap-3">
            <Coins size={16} className="text-yellow-400" />
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div style={{ width: `${stats.money}%` }} className="h-full bg-yellow-400" />
            </div>
            <span className="text-xs w-6 text-right">{stats.money}</span>
        </div>
        <div className="flex items-center gap-3">
            <Activity size={16} className="text-green-500" />
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div style={{ width: `${stats.health}%` }} className="h-full bg-green-500" />
            </div>
            <span className="text-xs w-6 text-right">{stats.health}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="z-10 text-center pt-2">
        <p className="text-[10px] text-gray-500">Kendi alternatif hayatını keşfet</p>
        <p className="text-xs text-[#ffd700]">whatif.life</p>
      </div>

    </div>
  );
});

ShareCard.displayName = "ShareCard";
export default ShareCard;
