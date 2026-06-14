"use client";

import type { MuscleGroup } from "@/lib/types";
import { muscleLabel } from "@/lib/utils";
import { Pill } from "@/components/ui";

export default function WeeklyMuscleMap({
  trained,
  pending,
}: {
  trained: MuscleGroup[];
  pending: MuscleGroup[];
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-[11px] uppercase tracking-widest text-green-400">Entrenados</p>
        <div className="flex flex-wrap gap-1.5">
          {trained.length === 0 && <span className="text-xs text-slate-500">Todavía nada esta semana</span>}
          {trained.map((m) => (
            <Pill key={m} tone="green">
              {muscleLabel(m)}
            </Pill>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-[11px] uppercase tracking-widest text-amber-400">Pendientes</p>
        <div className="flex flex-wrap gap-1.5">
          {pending.length === 0 && <span className="text-xs text-slate-500">¡Semana cubierta! 🔥</span>}
          {pending.map((m) => (
            <Pill key={m} tone="amber">
              {muscleLabel(m)}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
}
