# ⏱️ Time Blocking & Workday Planner

**Plan your workday intentionally.**

A modern time-blocking planner built with **Next.js 16 (App Router)**, **GSAP**, and **Zustand**.  
Designed for professionals and remote workers who want structured, focused workdays — not just another to-do list.

This project is built as a **showcase-quality frontend application**, emphasizing:

- interaction design
- motion clarity
- real-world scheduling logic

---

## 🚀 Live Concept

This app helps users:

- visually plan their day using time blocks
- protect focus time
- understand how their time is actually spent

Instead of managing tasks, users **design their time**.

---

## 🧠 Problem It Solves

Modern workdays are often:

- unstructured
- meeting-heavy
- fragmented by distractions

Traditional to-do lists don’t show:

- _when_ work happens
- _how long_ it really takes
- _where_ focus time is lost

This app solves that by making **time visible, draggable, and intentional**.

---

## 🎯 Key Features

### 📅 Timeline-Based Planning

- Vertical timeline representing the workday
- Time blocks for tasks, meetings, focus, and breaks
- Drag blocks to move them
- Resize blocks from top/bottom
- Snap to 15-minute intervals
- Collision detection (no overlaps)

### ➕ Smart Block Creation

- Add blocks with a required name
- Automatically finds the **next available time slot**
- Respects user-defined working hours
- Prevents adding blocks outside valid time ranges

### ✏️ Edit & Delete Blocks

- Inline editing for:
  - block title
  - block type
- Delete blocks instantly
- Auto-save on drag and resize release (no extra “save” click)

### 🎯 Focus Mode

- Enter distraction-free focus mode from any block
- GSAP-powered transition
- Minimal UI for deep work

### 📊 Insights (WIP)

- Completion rate
- Focus vs meeting time
- Lightweight productivity metrics

### ⚙️ Settings (Master Data)

- Set daily working hours
- Motion preferences (respects `prefers-reduced-motion`)
- All settings persist in localStorage

---

## ✨ Motion & Interaction Design (GSAP)

Animations are **purposeful**, not decorative.

Used for:

- block resize “settle” animation
- collision feedback (subtle nudge)
- focus mode transitions
- drag/resize visual feedback

Design principles:

- animate only `transform` and `opacity`
- fast micro-interactions (0.2–0.4s)
- reduced motion support

---

## 🧩 Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **GSAP** (GreenSock Animation Platform)
- **Zustand** (state management)
- **localStorage** persistence

---

## 🗂️ Project Structure

```txt
time-blocking-planner/
├─ app/
│  ├─ (marketing)/
│  ├─ (app)/
│  │  ├─ today/
│  │  ├─ week/
│  │  ├─ templates/
│  │  ├─ insights/
│  │  └─ settings/
│  ├─ api/
│  └─ providers.tsx
│
├─ components/
│  ├─ timeline/
│  ├─ shell/
│  ├─ templates/
│  └─ insights/
│
├─ features/
│  ├─ blocks/
│  ├─ focus/
│  ├─ templates/
│  └─ settings/
│
├─ animations/
│  ├─ gsapClient.ts
│  ├─ timeline.anim.ts
│  ├─ focus.anim.ts
│  └─ transitions.anim.ts
│
├─ hooks/
│  ├─ useResizeBlock.ts
│  ├─ useTimelineDrag.ts
│  └─ useLocalStorage.ts
│
├─ lib/
└─ public/
```
