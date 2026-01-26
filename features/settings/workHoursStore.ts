import { create } from "zustand";

type WorkHoursState = {
  workStartMin: number;
  workEndMin: number;
  setWorkHours: (startMin: number, endMin: number) => void;
  hydrate: (startMin: number, endMin: number) => void;
};

export const useWorkHoursStore = create<WorkHoursState>((set) => ({
  workStartMin: 9 * 60,
  workEndMin: 18 * 60,

  setWorkHours: (startMin, endMin) =>
    set({ workStartMin: startMin, workEndMin: endMin }),

  hydrate: (startMin, endMin) =>
    set({ workStartMin: startMin, workEndMin: endMin }),
}));
