"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { todayKey } from "@/lib/utils";
import type { MobilityRoutine } from "@/lib/types";
import { Card, Pill } from "@/components/ui";

function RoutineCard({ routine }: { routine: MobilityRoutine }) {
  const completeMobility = useStore((s) => s.completeMobility);
  const logs = useStore((s) => s.mobilityLogs);
  const done = logs.some((m) => m.date === todayKey() && m.routineId === routine.id && m.completed);

  const [checked, setChecked] = useState<boolean[]>(routine.steps.map(() => false));
  const allChecked = checked.every(Boolean);

  return (
    <Card glow={done}>
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="font-bold text-white">{routine.name}</h3>
          <p className="text-xs text-slate-400">{routine.description}</p>
        </div>
        <Pill tone={done ? "green" : "blue"}>{routine.totalMinutes} min</Pill>
      </div>

      <div className="space-y-1.5">
        {routine.steps.map((step, i) => (
          <button
            key={i}
            disabled={done}
            onClick={() => setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)))}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${
              done || checked[i]
                ? "border-green-500/40 bg-green-500/10 text-slate-200"
                : "border-line bg-bg-elev text-slate-300"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-md border text-[10px] ${
                done || checked[i] ? "border-green-500 bg-green-500/20 text-green-300" : "border-slate-600"
              }`}
            >
              {done || checked[i] ? "✓" : ""}
            </span>
            <span className="flex-1">
              <span className="font-medium">{step.name}</span>
              <span className="block text-[11px] text-slate-500">{step.detail}</span>
            </span>
            <span className="text-xs text-hunter-cyan">{step.duration}</span>
          </button>
        ))}
      </div>

      {done ? (
        <p className="mt-3 text-center text-sm font-semibold text-green-400">
          ✓ Completada hoy · +15 XP
        </p>
      ) : (
        <button
          disabled={!allChecked}
          onClick={() => completeMobility(routine.id, routine.totalMinutes)}
          className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition active:scale-[0.98] ${
            allChecked
              ? "bg-gradient-to-r from-hunter-blue to-hunter-violet text-white"
              : "bg-bg-elev text-slate-500"
          }`}
        >
          {allChecked ? "Marcar movilidad completada (+15 XP)" : "Completá todos los pasos"}
        </button>
      )}
    </Card>
  );
}

export default function MobilityChecklist() {
  const routines = useStore((s) => s.mobilityRoutines);
  return (
    <div className="space-y-4">
      {routines.map((r) => (
        <RoutineCard key={r.id} routine={r} />
      ))}
    </div>
  );
}
