"use client";

import type { Achievement } from "@/lib/types";

export default function AchievementBadge({ a }: { a: Achievement }) {
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-center transition ${
        a.unlocked
          ? "border-hunter-violet/40 bg-hunter-violet/10 shadow-glow-violet"
          : "border-line bg-bg-elev opacity-50"
      }`}
    >
      <span className={`text-2xl ${a.unlocked ? "" : "grayscale"}`}>{a.icon}</span>
      <p className="text-[11px] font-semibold leading-tight text-white">{a.name}</p>
      <p className="text-[9px] leading-tight text-slate-400">{a.description}</p>
    </div>
  );
}
