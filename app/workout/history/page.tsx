"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { exerciseById } from "@/lib/data/exercises";
import { formatDate, formatTime, muscleLabel } from "@/lib/utils";
import { symptomLabel } from "@/lib/safety";
import type { WorkoutLog } from "@/lib/types";
import { Card, Pill, PageHeader, EmptyState } from "@/components/ui";

function LogCard({ log }: { log: WorkoutLog }) {
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left">
        <div>
          <p className="font-semibold text-white">{log.templateName}</p>
          <p className="text-xs text-slate-400">
            {formatDate(log.date)} · {formatTime(log.date)} · {log.duration} min
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gradient">+{log.xpEarned} XP</p>
          <p className="text-[11px] text-slate-400">{log.totalVolume.toLocaleString("es-AR")} kg</p>
        </div>
      </button>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {log.muscleGroups.slice(0, open ? 99 : 4).map((m) => (
          <Pill key={m}>{muscleLabel(m)}</Pill>
        ))}
        {log.prs.length > 0 && <Pill tone="amber">🏆 {log.prs.length} PR</Pill>}
        {log.symptoms.length > 0 && <Pill tone="red">⚠ síntomas</Pill>}
      </div>

      {open && (
        <div className="mt-3 space-y-2 border-t border-line pt-3">
          {log.exercisesLogged.map((el, i) => {
            const id = el.swapped && el.swappedFor ? el.swappedFor : el.exerciseId;
            const done = el.sets.filter((s) => s.completed);
            return (
              <div key={i} className="text-sm">
                <p className="font-medium text-slate-200">
                  {exerciseById(id)?.name ?? id}
                  {el.swapped && <span className="ml-1 text-[10px] text-violet-300">(cambiado)</span>}
                </p>
                <p className="text-xs text-slate-400">
                  {done.map((s) => `${s.actualWeight}×${s.actualReps}`).join("  ·  ") || "sin series"}
                </p>
              </div>
            );
          })}
          {log.prs.length > 0 && (
            <div className="text-xs text-amber-300">
              {log.prs.map((p, i) => (
                <p key={i}>🏆 {p}</p>
              ))}
            </div>
          )}
          {log.symptoms.length > 0 && (
            <p className="text-xs text-red-300">
              Síntomas: {log.symptoms.map(symptomLabel).join(", ")}
            </p>
          )}
          {log.notes && <p className="text-xs italic text-slate-400">“{log.notes}”</p>}
        </div>
      )}
    </Card>
  );
}

export default function HistoryPage() {
  const logs = useStore((s) => s.workoutLogs);
  const sorted = [...logs].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div className="space-y-4">
      <PageHeader title="Historial" subtitle={`${logs.length} entrenamientos registrados`} />
      {sorted.length === 0 ? (
        <EmptyState icon="📜" text="Todavía no registraste entrenamientos. Cuando guardes uno, aparecerá acá." />
      ) : (
        sorted.map((l) => <LogCard key={l.id} log={l} />)
      )}
    </div>
  );
}
