import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BirthData {
  date: string;
  time: string;
  isTimeUnknown: boolean;
  place: string;
}

interface AvatarData {
  hairColor: string;
  hairStyle: string;
  skinTone: string;
  gender: string;
  name: string;
}

interface ChoiceData {
  category: string;
  text: string;
}

interface SimulationResponse {
  title: string;
  period: string;
  age: number;
  story_text: string;
  stats_change: {
    happiness: number;
    money: number;
    health: number;
  };
  mini_choice?: {
    question: string;
    options: string[];
  };
}

interface SimulationState {
  step: number;
  birthData: BirthData;
  avatarData: AvatarData;
  choiceData: ChoiceData;
  
  // Active Simulation State
  currentChapter: SimulationResponse | null;
  stats: {
    happiness: number;
    money: number;
    health: number;
  };
  history: SimulationResponse[];
  generatedAvatarUrl: string | null;

  setStep: (step: number) => void;
  setBirthData: (data: Partial<BirthData>) => void;
  setAvatarData: (data: Partial<AvatarData>) => void;
  setChoiceData: (data: Partial<ChoiceData>) => void;
  setGeneratedAvatarUrl: (url: string) => void;
  
  setSimulationStart: (chapter: SimulationResponse) => void;
  addChapter: (chapter: SimulationResponse) => void;
  reset: () => void;
}

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set) => ({
      step: 1,
      birthData: {
        date: '',
        time: '',
        isTimeUnknown: false,
        place: '',
      },
      avatarData: {
        hairColor: 'brown',
        hairStyle: 'wavy',
        skinTone: 'medium',
        gender: 'neutral',
        name: '',
      },
      choiceData: {
        category: 'love',
        text: '',
      },
      
      currentChapter: null,
      stats: { happiness: 50, money: 50, health: 50 },
      history: [],
      generatedAvatarUrl: null,

      setStep: (step) => set({ step }),
      setBirthData: (data) =>
        set((state) => ({ birthData: { ...state.birthData, ...data } })),
      setAvatarData: (data) =>
        set((state) => ({ avatarData: { ...state.avatarData, ...data } })),
      setChoiceData: (data) =>
        set((state) => ({ choiceData: { ...state.choiceData, ...data } })),
      setGeneratedAvatarUrl: (url) => set({ generatedAvatarUrl: url }),
      
      setSimulationStart: (chapter) => set((state) => {
        // Apply initial stat changes (relative to base 50)
        const newStats = {
            happiness: Math.min(100, Math.max(0, 50 + chapter.stats_change.happiness)),
            money: Math.min(100, Math.max(0, 50 + chapter.stats_change.money)),
            health: Math.min(100, Math.max(0, 50 + chapter.stats_change.health)),
        };
        return {
            currentChapter: chapter,
            stats: newStats,
            history: [chapter]
        };
      }),

      addChapter: (chapter) => set((state) => {
        const newStats = {
            happiness: Math.min(100, Math.max(0, state.stats.happiness + chapter.stats_change.happiness)),
            money: Math.min(100, Math.max(0, state.stats.money + chapter.stats_change.money)),
            health: Math.min(100, Math.max(0, state.stats.health + chapter.stats_change.health)),
        };
        return {
            currentChapter: chapter,
            stats: newStats,
            history: [...state.history, chapter]
        };
      }),

      reset: () =>
        set({
          step: 1,
          birthData: { date: '', time: '', isTimeUnknown: false, place: '' },
          avatarData: { hairColor: 'brown', hairStyle: 'straight', skinTone: 'medium', gender: 'neutral', name: '' },
          choiceData: { category: 'love', text: '' },
          currentChapter: null,
          stats: { happiness: 50, money: 50, health: 50 },
          history: [],
          generatedAvatarUrl: null,
        }),
    }),
    {
      name: 'whatif-simulation-storage',
    }
  )
);
