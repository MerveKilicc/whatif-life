import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('landing');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Dynamic Background via Pollinations.ai */}
      <img 
        src="https://image.pollinations.ai/prompt/mystic%20cosmos%20starry%20night%20sky%20with%20nebula%20deep%20purple%20and%20gold%20cinematic%20lighting%20high%20resolution?width=1080&height=1920&nologo=true"
        alt="Cosmic Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
      />
      
      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      <div className="z-10 flex flex-col items-center gap-8 max-w-2xl">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#ffd700] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
          {t('headline')}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 font-light drop-shadow-md">
          {t('subheadline')}
        </p>
        
        <Link 
          href="/input" 
          className="mt-8 px-8 py-4 bg-[#533483]/90 hover:bg-[#6b42a9] text-white rounded-full text-lg font-semibold transition-all shadow-[0_0_20px_rgba(83,52,131,0.6)] hover:shadow-[0_0_30px_rgba(83,52,131,0.9)] backdrop-blur-sm border border-[#ffffff20]"
        >
          {t('cta')}
        </Link>
      </div>
    </main>
  );
}