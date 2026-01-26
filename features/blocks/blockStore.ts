import { create } from "zustand";
import { TimeBlock } from "./types";

type State = {
  blocks: TimeBlock[];

  addBlock: (b: TimeBlock) => void;
  deleteBlock: (id: string) => void;

  toggleComplete: (id: string) => void;

  updateBlockTime: (id: string, startMin: number, endMin: number) => void;
  updateBlockMeta: (
    id: string,
    patch: Partial<Pick<TimeBlock, "title" | "type">>,
  ) => void;

  setBlocks: (blocks: TimeBlock[]) => void;
  hydrate: (blocks: TimeBlock[]) => void;
};

export const useBlockStore = create<State>((set) => ({
  blocks: [],

  addBlock: (b) => set((s) => ({ blocks: [...s.blocks, b] })),

  deleteBlock: (id) =>
    set((s) => ({ blocks: s.blocks.filter((b) => b.id !== id) })),

  toggleComplete: (id) =>
    set((s) => ({
      blocks: s.blocks.map((b) =>
        b.id === id ? { ...b, completed: !b.completed } : b,
      ),
    })),

  updateBlockTime: (id, startMin, endMin) =>
    set((s) => ({
      blocks: s.blocks.map((b) =>
        b.id === id ? { ...b, startMin, endMin } : b,
      ),
    })),

  updateBlockMeta: (id, patch) =>
    set((s) => ({
      blocks: s.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    })),

  setBlocks: (blocks) => set({ blocks }),
  hydrate: (blocks) => set({ blocks }),
}));
