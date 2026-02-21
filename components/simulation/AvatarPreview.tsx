"use client";

import { useSimulationStore } from "@/stores/simulationStore";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";

export default function AvatarPreview() {
  const { avatarData, setGeneratedAvatarUrl } = useSimulationStore();
  const { gender, hairColor, hairStyle, skinTone } = avatarData;
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = useMemo(() => {
    setIsLoading(true); // Reset loading when data changes
    if (!gender || !hairColor || !hairStyle || !skinTone) {
      return "";
    }

    // We MUST use 'avataaars' style to allow explicit property matching (top, hairColor, skinColor).
    // The keys and hex codes below strictly match the valid DiceBear v9 schema to prevent 400 Bad Requests.

    const hairMap: Record<string, string> = {
      straight: "straight01",
      wavy: "shortWaved",
      curly: "curly",
      short: "shortFlat",
      long: "longButNotTooLong",
      bald: "shortRound" // 'bald'/'none' isn't explicitly supported in top, so shortRound is closest.
    };

    const colorMap: Record<string, string> = {
      black: "2c1b18",
      brown: "724133",
      blonde: "d6b370",
      red: "ca4420",
      auburn: "a55728",
      gray: "e8e1e1"
    };

    const skinMap: Record<string, string> = {
      pale: "ffdbb4",
      fair: "edb98a",
      medium: "d08b5b",
      olive: "ae5d29",
      dark: "614335"
    };

    const top = hairMap[hairStyle] || "shortFlat";
    const hColor = colorMap[hairColor] || "724133";
    const skin = skinMap[skinTone] || "edb98a";

    const params = new URLSearchParams({
      seed: String(Math.floor(Math.random() * 10000)), // Keeps facial features dynamic
      top: top,
      hairColor: hColor,
      skinColor: skin,
      backgroundColor: "transparent",
    });

    return `https://api.dicebear.com/9.x/avataaars/svg?${params.toString()}`;
  }, [gender, hairColor, hairStyle, skinTone]);

  // Save generated URL to store so ShareCard can use the EXACT same image
  useEffect(() => {
    if (imageUrl) {
      setGeneratedAvatarUrl(imageUrl);
    }
  }, [imageUrl, setGeneratedAvatarUrl]);

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="flex justify-center items-center h-48 w-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.3)] bg-[#0f1526] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0f1526] z-10">
          <div className="w-10 h-10 border-4 border-t-[#ffd700] border-r-transparent border-b-[#ffd700] border-l-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imageUrl}
        alt="Avatar Preview"
        width={512}
        height={512}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
