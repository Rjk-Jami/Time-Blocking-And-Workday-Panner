import { create } from "zustand";

type MotionPrefs = {
  reducedMotion: boolean;
  setReduced: (v: boolean) => void;
};

export const useMotionPrefsStore = create<MotionPrefs>((set) => ({
  reducedMotion: false,
  setReduced: (v) => set({ reducedMotion: v }),
}));
