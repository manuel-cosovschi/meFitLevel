"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { ruleFor } from "@/lib/data/progressionRules";
import { muscleLabel } from "@/lib/utils";
import { Card, PageHeader, Pill } from "@/components/ui";
import type { Exercise } from "@/lib/types";

const TYPE_TONE = {
  compuesto: "blue",
  aislado: "violet",
  core: "green",
  movilidad: "amber",
} as const;

export default function ExercisesPage() {
  const exercises = useStore((s) => s.exercises);
  const overrides = useStore((s) => s.weightOverrides);
  const [q, setQ] = useState("");

  const grouped = useMemo(() => {
    const filtered = exercises.filter(
      (e) =>
        e.name.toLowerCase().includes(q.toLowerCase()) ||
        e.category.toLowerCase().includes(q.toLowerCase()),
    );
    const map = new Map<string, Exercise[]>();
    filtered.forEach((e) => {
      const arr = map.get(e.category) ?? [];
      arr.push(e);
      map.set(e.category, arr);
    });
    return [...map.entries()];
  }, [exercises, q]);

  return (
    <div className="space-y-4">
      <PageHeader title="Ejercicios" subtitle={`${exercises.length} en el catálogo`} />

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar ejercicio o grupo…"
        className="w-full rounded-xl border border-line bg-bg-elev px-4 py-3 text-sm text-white placeholder:text-slate-500"
      />

      {grouped.map(([cat, list]) => (
        <Card key={cat}>
          <p className="mb-2 text-sm font-bold text-hunter-cyan">{cat}</p>
          <div className="space-y-2">
            {list.map((e) => {
              const rule = ruleFor(e.id);
              const w = overrides[e.id];
              return (
                <div key={e.id} className="rounded-xl border border-line bg-bg-elev/40 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">{e.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {muscleLabel(e.primaryMuscle)}
                        {e.secondaryMuscles.length > 0 &&
                          ` · ${e.secondaryMuscles.map(muscleLabel).join(", ")}`}
                      </p>
                    </div>
                    <Pill tone={TYPE_TONE[e.type]}>{e.type}</Pill>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    {rule && (
                      <Pill>
                        {rule.minReps}-{rule.maxReps} reps · RIR {rule.rirTarget}
                      </Pill>
                    )}
                    {w != null && <Pill tone="green">actual: {w}kg</Pill>}
                    <Pill>descanso {e.defaultRest}s</Pill>
                  </div>
                  {e.notes && <p className="mt-1.5 text-[11px] italic text-slate-500">{e.notes}</p>}
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
