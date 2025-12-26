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

    // Improved prompt for realism and consistency
    const prompt = `realistic portrait of a ${gender} person, ${hairStyle} ${hairColor} hair, ${skinTone} skin tone, neutral expression, looking at camera, cinematic lighting, 8k resolution, detailed texture, digital art style`;
    
    const encodedPrompt = encodeURIComponent(prompt);
    // Add seed to keep it somewhat consistent or random (random is default)
    // Using a random seed each time ensures a new image is generated when parameters change
    const seed = Math.floor(Math.random() * 10000);
    
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed}`;
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
      <Image
        src={imageUrl}
        alt="Avatar Preview"
        width={512}
        height={512}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        unoptimized
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
