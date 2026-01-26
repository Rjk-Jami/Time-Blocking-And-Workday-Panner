"use client";

import { useEffect, useRef, useState } from "react";

import { useMotionPrefsStore } from "@/animations/useMotionPrefs";
import gsap from "gsap";
import { playFocusEnter, playFocusExit } from "@/animations/focus.anim";
import { useFocusStore } from "@/features/blocks/focusStore";
import { useBlockStore } from "@/features/blocks/blockStore";

export default function FocusModeOverlay() {
  const { isFocusMode, focusBlockId, exit } = useFocusStore();
  const { blocks } = useBlockStore();
  const { reducedMotion } = useMotionPrefsStore();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const block = blocks.find((b) => b.id === focusBlockId) ?? null;

  useEffect(() => {
    if (!isFocusMode) {
      setMounted(false);
      return;
    }
    setMounted(true);
  }, [isFocusMode]);

  useEffect(() => {
    if (!mounted) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(root, { opacity: 1 });
        gsap.set(root.querySelector("[data-focus-card]"), {
          opacity: 1,
          y: 0,
          scale: 1,
        });
      } else {
        playFocusEnter(root);
      }
    }, root);

    return () => ctx.revert();
  }, [mounted, reducedMotion]);

  if (!mounted) return null;

  const close = () => {
    const root = rootRef.current;
    if (!root || reducedMotion) {
      exit();
      return;
    }
    playFocusExit(root).then(() => exit());
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div
        data-focus-card
        className="w-[min(560px,92vw)] rounded-2xl bg-white p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-neutral-600">Focus Mode</div>
            <div className="text-xl font-semibold">
              {block?.title ?? "Session"}
            </div>
            <div className="text-sm text-neutral-600 mt-1">
              Minimal UI — stay locked in.
            </div>
          </div>
          <button className="px-3 py-2 rounded-xl border" onClick={close}>
            Exit
          </button>
        </div>

        <div className="mt-4 rounded-xl border p-4 text-sm text-neutral-700">
          (Timer + distractions blocker UI comes next)
        </div>
      </div>
    </div>
  );
}
