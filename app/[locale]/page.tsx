import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('landing');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-[#2a3b5e] to-[#16213e] z-0 pointer-events-none" />
      <div className="absolute inset-0 opacity-20 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="z-10 flex flex-col items-center gap-8 max-w-2xl">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#ffd700] drop-shadow-lg">
          {t('headline')}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          {t('subheadline')}
        </p>
        
        <Link 
          href="/input" 
          className="mt-8 px-8 py-4 bg-[#533483] hover:bg-[#6b42a9] text-white rounded-full text-lg font-semibold transition-all shadow-[0_0_15px_rgba(83,52,131,0.5)] hover:shadow-[0_0_25px_rgba(83,52,131,0.8)]"
        >
          {t('cta')}
        </Link>
      </div>
    </main>
  );
}