"use client";

import { useState } from "react";
import type { ExerciseLog, SetLog, Exercise } from "@/lib/types";
import type { SessionExercise } from "@/lib/selectors";
import { exerciseById } from "@/lib/data/exercises";
import SetLogger from "@/components/SetLogger";
import ProgressionBadge from "@/components/ProgressionBadge";
import { Pill } from "@/components/ui";
import { muscleLabel } from "@/lib/utils";

export default function ExerciseCard({
  session,
  log,
  onUpdateSet,
  onSwap,
  index,
}: {
  session: SessionExercise;
  log: ExerciseLog;
  onUpdateSet: (setIndex: number, partial: Partial<SetLog>) => void;
  onSwap: (alt: Exercise) => void;
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);
  const [showAlts, setShowAlts] = useState(false);

  const ex = session.exercise;
  const activeId = log.swapped && log.swappedFor ? log.swappedFor : log.exerciseId;
  const activeEx = exerciseById(activeId) ?? ex;
  const alternatives = (ex?.alternatives ?? [])
    .map((id) => exerciseById(id))
    .filter(Boolean) as Exercise[];

  const doneSets = log.sets.filter((s) => s.completed).length;
  const allDone = doneSets === log.sets.length;

  return (
    <div
      className={`rounded-2xl border bg-bg-card/80 transition ${
        allDone ? "border-green-500/40" : "border-line"
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
            allDone ? "bg-green-500/20 text-green-300" : "bg-bg-elev text-hunter-cyan"
          }`}
        >
          {allDone ? "✓" : index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">{activeEx?.name ?? "Ejercicio"}</p>
          <p className="text-[11px] text-slate-400">
            {activeEx && muscleLabel(activeEx.primaryMuscle)} · {session.we.targetReps} reps · RIR{" "}
            {session.we.targetRir} · descanso {activeEx?.defaultRest ?? 90}s
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] text-slate-400">
            {doneSets}/{log.sets.length}
          </span>
          {session.suggestion && <ProgressionBadge suggestion={session.suggestion} />}
        </div>
      </button>

      {open && (
        <div className="space-y-2 px-3 pb-3">
          {session.deload && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
              ⚠ Rendimiento bajo en las últimas sesiones: considerá un deload (menos volumen/intensidad).
            </div>
          )}
          {(activeEx?.notes || session.we.notes) && (
            <p className="px-1 text-[11px] italic text-slate-500">
              {session.we.notes ?? activeEx?.notes}
            </p>
          )}

          {log.sets.map((s, i) => (
            <SetLogger key={i} set={s} onChange={(p) => onUpdateSet(i, p)} />
          ))}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setShowAlts((v) => !v)}
              className="flex-1 rounded-lg bg-bg-elev py-2 text-xs font-semibold text-slate-300 active:scale-[0.98]"
            >
              🔄 Máquina ocupada / cambiar
            </button>
            {log.swapped && <Pill tone="violet">cambiado</Pill>}
          </div>

          {showAlts && (
            <div className="space-y-1.5 rounded-xl border border-line bg-bg-soft p-2">
              <p className="px-1 text-[11px] text-slate-400">Alternativas sugeridas:</p>
              {alternatives.length === 0 && (
                <p className="px-1 text-[11px] text-slate-500">Sin alternativas cargadas.</p>
              )}
              {alternatives.map((alt) => (
                <button
                  key={alt.id}
                  onClick={() => {
                    onSwap(alt);
                    setShowAlts(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg bg-bg-elev px-3 py-2 text-left text-sm text-slate-200 active:scale-[0.98]"
                >
                  <span>{alt.name}</span>
                  <span className="text-[10px] text-slate-500">{muscleLabel(alt.primaryMuscle)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
