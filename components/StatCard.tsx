"use client";

import type { RPGStats } from "@/lib/types";
import { ProgressBar } from "@/components/ui";

const STAT_LABELS: Record<keyof RPGStats, { label: string; icon: string }> = {
  strength: { label: "Fuerza", icon: "💪" },
  hypertrophy: { label: "Hipertrofia", icon: "🩸" },
  endurance: { label: "Resistencia", icon: "🫁" },
  mobility: { label: "Movilidad", icon: "🧘" },
  discipline: { label: "Disciplina", icon: "🗡️" },
  core: { label: "Core", icon: "🔩" },
  upperBody: { label: "Tren superior", icon: "🧍" },
  lowerBody: { label: "Tren inferior", icon: "🦵" },
  recovery: { label: "Recuperación", icon: "💤" },
};

export function StatRow({ stat, value, max }: { stat: keyof RPGStats; value: number; max: number }) {
  const meta = STAT_LABELS[stat];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-300">
          {meta.icon} {meta.label}
        </span>
        <span className="font-semibold text-hunter-cyan">{value}</span>
      </div>
      <ProgressBar value={value} max={max} color="violet" />
    </div>
  );
}

export default function StatGrid({ stats }: { stats: RPGStats }) {
  const max = Math.max(20, ...Object.values(stats)) * 1.15;
  return (
    <div className="grid grid-cols-1 gap-3">
      {(Object.keys(stats) as (keyof RPGStats)[]).map((k) => (
        <StatRow key={k} stat={k} value={stats[k]} max={max} />
      ))}
    </div>
  );
}
