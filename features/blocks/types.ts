export type BlockType = "focus" | "meeting" | "task" | "break";

export type TimeBlock = {
  id: string;
  title: string;
  type: BlockType;
  startMin: number; // minutes from 00:00
  endMin: number; // minutes from 00:00
  completed: boolean;
};
