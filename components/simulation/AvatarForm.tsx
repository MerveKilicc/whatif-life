"use client";

import { useSimulationStore } from "@/stores/simulationStore";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import AvatarPreview from "./AvatarPreview"; // Import the new component

export default function AvatarForm() {
  const t = useTranslations("input");
  const { avatarData, setAvatarData } = useSimulationStore();

  const hairStyles = ["straight", "wavy", "curly", "short", "long", "bald"];
  const hairColors = ["black", "brown", "blonde", "red", "auburn", "gray"];
  const skinTones = ["pale", "fair", "medium", "olive", "dark"];

  // Helper for color codes (visual representation)
  const colorMap: Record<string, string> = {
    black: "#000000",
    brown: "#4a3b2a",
    blonde: "#e6c288",
    red: "#b93b2a",
    auburn: "#914232",
    gray: "#9e9e9e",
    pale: "#fceadd",
    fair: "#f5d0b0",
    medium: "#c58c85",
    olive: "#a67b5b",
    dark: "#5c3a3a",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6 w-full max-w-md"
    >
      <h2 className="text-2xl font-serif text-[#ffd700] mb-4">{t("step_2_title")}</h2>
      
      <AvatarPreview />

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">{t("name")}</label>
        <input
          type="text"
          value={avatarData.name}
          onChange={(e) => setAvatarData({ name: e.target.value })}
          className="bg-[#16213e] border border-gray-600 rounded-lg p-3 text-white focus:border-[#ffd700] outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">{t("gender")}</label>
        <div className="flex gap-2">
          {["female", "male", "neutral"].map((g) => (
            <button
              key={g}
              onClick={() => setAvatarData({ gender: g })}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                avatarData.gender === g
                  ? "border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]"
                  : "border-gray-600 text-gray-400 hover:border-gray-400"
              }`}
            >
              {t(`gender_${g}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">{t("hair_style")}</label>
        <div className="grid grid-cols-3 gap-2">
          {hairStyles.map((style) => (
            <button
              key={style}
              onClick={() => setAvatarData({ hairStyle: style })}
              className={`p-2 rounded-lg border text-sm transition-all ${
                avatarData.hairStyle === style
                  ? "border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]"
                  : "border-gray-600 text-gray-400 hover:border-gray-400"
              }`}
            >
              {t(`style_${style}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">{t("hair_color")}</label>
        <div className="flex gap-2 flex-wrap">
          {hairColors.map((color) => (
            <button
              key={color}
              onClick={() => setAvatarData({ hairColor: color })}
              title={t(`color_${color}`)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                avatarData.hairColor === color ? "border-[#ffd700] scale-110" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              style={{ backgroundColor: colorMap[color] }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">{t("skin_tone")}</label>
        <div className="flex gap-2 flex-wrap">
           {skinTones.map((tone) => (
            <button
              key={tone}
              onClick={() => setAvatarData({ skinTone: tone })}
              title={t(`tone_${tone}`)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                avatarData.skinTone === tone ? "border-[#ffd700] scale-110" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              style={{ backgroundColor: colorMap[tone] }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
