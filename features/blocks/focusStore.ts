import { create } from "zustand";

type FocusState = {
  isFocusMode: boolean;
  focusBlockId: string | null;
  enter: (blockId: string) => void;
  exit: () => void;
};

export const useFocusStore = create<FocusState>((set) => ({
  isFocusMode: false,
  focusBlockId: null,
  enter: (blockId) => set({ isFocusMode: true, focusBlockId: blockId }),
  exit: () => set({ isFocusMode: false, focusBlockId: null }),
}));
