"use client";

import { useSimulationStore } from "@/stores/simulationStore";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function ChoiceForm() {
  const t = useTranslations("input");
  const { choiceData, setChoiceData } = useSimulationStore();

  const categories = ["love", "career", "location", "education", "risk"];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6 w-full max-w-md"
    >
      <h2 className="text-2xl font-serif text-[#ffd700] mb-4">{t("step_3_title")}</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">{t("category")}</label>
        <select
          value={choiceData.category}
          onChange={(e) => setChoiceData({ category: e.target.value })}
          className="bg-[#16213e] border border-gray-600 rounded-lg p-3 text-white focus:border-[#ffd700] outline-none appearance-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {t(`category_${cat}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">{t("choice_label")}</label>
        <textarea
          value={choiceData.text}
          onChange={(e) => setChoiceData({ text: e.target.value })}
          placeholder={t("choice_placeholder")}
          rows={4}
          maxLength={280}
          className="bg-[#16213e] border border-gray-600 rounded-lg p-3 text-white focus:border-[#ffd700] outline-none resize-none"
        />
        <div className="text-right text-xs text-gray-500">
          {choiceData.text.length}/280
        </div>
      </div>
    </motion.div>
  );
}
