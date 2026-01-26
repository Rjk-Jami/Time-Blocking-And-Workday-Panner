"use client";

import { useMemo, useRef, useState } from "react";
import { TimeBlock } from "@/features/blocks/types";
import { useBlockStore } from "@/features/blocks/blockStore";
import { fmtTime } from "@/features/blocks/blockMath";
import { useResizeBlock } from "@/hooks/useResizeBlock";
import BlockResizeHandle from "./BlockResizeHandle";
import { invalidNudge, snapSettle } from "@/animations/timeline.anim";
import { createMoveBlockDrag } from "@/hooks/useTimelineDrag";
import { useFocusStore } from "@/features/blocks/focusStore";

function typeClass(t: TimeBlock["type"]) {
  switch (t) {
    case "focus":
      return "bg-indigo-600 text-white border-indigo-700";
    case "meeting":
      return "bg-amber-200 text-neutral-900 border-amber-300";
    case "break":
      return "bg-emerald-200 text-neutral-900 border-emerald-300";
    default:
      return "bg-slate-800 text-white border-slate-900";
  }
}

export default function BlockItem({
  block,
  dayStart,
  dayEnd,
  trackHeight,
}: {
  block: TimeBlock;
  dayStart: number;
  dayEnd: number;
  trackHeight: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const {
    blocks,
    toggleComplete,
    updateBlockTime,
    updateBlockMeta,
    deleteBlock,
  } = useBlockStore();

  const { enter } = useFocusStore();

  // UI states
  const [isHover, setIsHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(block.title);
  const [editType, setEditType] = useState<TimeBlock["type"]>(block.type);

  // ghost preview (during drag/resize)
  const [ghost, setGhost] = useState<{
    startMin: number;
    endMin: number;
  } | null>(null);
  const ghostRef = useRef<{ startMin: number; endMin: number } | null>(null);

  // MUST match Timeline height
  const PX_HEIGHT = trackHeight;
  const SNAP_STEP = 15;
  const MIN_DUR = 15;

  // RESIZE hook
  const { begin, update, end } = useResizeBlock({
    block,
    allBlocks: blocks,
    dayStart,
    dayEnd,
    pxHeight: PX_HEIGHT,
    snapStepMin: SNAP_STEP,
    minDurationMin: MIN_DUR,
  });

  // MOVE (drag body)
  const duration = block.endMin - block.startMin;
  const mover = createMoveBlockDrag({
    block,
    allBlocks: blocks,
    dayStart,
    dayEnd,
    pxHeight: PX_HEIGHT,
    snapStepMin: SNAP_STEP,
  });

  // times to render
  const startMin = ghost?.startMin ?? block.startMin;
  const endMin = ghost?.endMin ?? block.endMin;

  const { top, height } = useMemo(() => {
    const total = dayEnd - dayStart;
    const pxPerMin = PX_HEIGHT / total;
    return {
      top: (startMin - dayStart) * pxPerMin,
      height: Math.max((endMin - startMin) * pxPerMin),
    };
  }, [startMin, endMin, dayStart, dayEnd]);

  // ---- RESIZE POINTER ----
  const attachResizePointer = (
    e: React.PointerEvent,
    edge: "top" | "bottom",
  ) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    setIsResizing(true);
    ghostRef.current = null;

    begin(edge, e.clientY);

    const onMove = (ev: PointerEvent) => {
      const res = update(ev.clientY);
      if (!res) return;

      if (res.blocked) {
        if (ref.current) invalidNudge(ref.current);
        return;
      }

      const next = { startMin: res.nextStart, endMin: res.nextEnd };
      ghostRef.current = next;
      setGhost(next);
    };

    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);

      setIsResizing(false);

      const fin = end(ev.clientY);
      if (!fin) return;

      if (fin.blocked) {
        ghostRef.current = null;
        setGhost(null);
        if (ref.current) invalidNudge(ref.current);
        return;
      }

      // AUTO SAVE on release
      updateBlockTime(block.id, fin.finalStart, fin.finalEnd);

      ghostRef.current = null;
      setGhost(null);

      requestAnimationFrame(() => {
        if (ref.current) snapSettle(ref.current);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
  };

  // ---- MOVE POINTER (DRAG BODY) ----
  const onPointerDownMove = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;

    // don't start drag on resize handles / buttons / while editing
    if (isEditing) return;
    if (target.closest("[data-resize-handle]")) return;
    if (target.closest("button")) return;
    if (target.closest("input,select,textarea")) return;

    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    setIsDragging(true);
    ghostRef.current = null;

    const startY = e.clientY;
    const startStart = block.startMin;

    const onMove = (ev: PointerEvent) => {
      const res = mover.compute(ev.clientY, startY, startStart, duration);
      if (res.blocked) {
        if (ref.current) invalidNudge(ref.current);
        return;
      }
      const next = { startMin: res.nextStart, endMin: res.nextEnd };
      ghostRef.current = next;
      setGhost(next);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);

      setIsDragging(false);

      // ✅ AUTO SAVE on release (no stale state bug)
      const final = ghostRef.current;
      if (final) {
        updateBlockTime(block.id, final.startMin, final.endMin);
      }

      ghostRef.current = null;
      setGhost(null);

      requestAnimationFrame(() => {
        if (ref.current) snapSettle(ref.current);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
  };

  const saveEdit = () => {
    const name = editTitle.trim();
    if (!name) return;
    updateBlockMeta(block.id, { title: name, type: editType });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditTitle(block.title);
    setEditType(block.type);
    setIsEditing(false);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDownMove}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={[
        "overflow-hidden my-2 hover:ring-2 hover:ring-yellow-500 hover:z-999 ",
        "absolute left-16 right-4 rounded-xl px-3  border shadow-sm",
        "transition-[box-shadow,transform,outline,ring] duration-150 select-none",
        typeClass(block.type),
        block.completed ? "opacity-80" : "opacity-100",
        isHover ? "shadow-md" : "shadow-sm",
        isDragging
          ? "outline-2 outline-black/30 scale-[1.01] cursor-grabbing"
          : "cursor-grab",
        isResizing ? "outline-2 outline-black/30" : "",
      ].join(" ")}
      style={{ top, height }}
    >
      <BlockResizeHandle
        edge="top"
        onPointerDown={(e) => attachResizePointer(e, "top")}
      />
      <BlockResizeHandle
        edge="bottom"
        onPointerDown={(e) => attachResizePointer(e, "bottom")}
      />

      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          {!isEditing ? (
            <div className="flex items-center gap-2">
              <div className="font-semibold truncate">{block.title}</div>
              <div className="text-xs opacity-90">
                {fmtTime(startMin)} – {fmtTime(endMin)}
              </div>
              {isDragging || isResizing ? (
                <div className=" text-[10px] opacity-90">
                  {isDragging ? "Dragging…" : "Resizing…"} (auto-saves on
                  release)
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-2">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg border px-2 py-1 text-sm text-neutral-900"
                placeholder="Block title"
              />
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value as any)}
                className="w-full rounded-lg border px-2 py-1 text-sm text-neutral-900"
              >
                <option value="task">Task</option>
                <option value="focus">Focus</option>
                <option value="meeting">Meeting</option>
                <option value="break">Break</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-2 text-xs shrink-0">
          {!isEditing ? (
            <>
              <button
                className="underline"
                onClick={() => toggleComplete(block.id)}
              >
                {block.completed ? "Undo" : "Done"}
              </button>
              <button className="underline" onClick={() => enter(block.id)}>
                Focus
              </button>
              <button className="underline" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button
                className="underline"
                onClick={() => deleteBlock(block.id)}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button className="underline" onClick={saveEdit}>
                Save
              </button>
              <button className="underline" onClick={cancelEdit}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
