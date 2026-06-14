"use client";

import type { SetLog } from "@/lib/types";
import { repsLabel, round05 } from "@/lib/utils";

const KIND_LABEL: Record<SetLog["kind"], string> = {
  calentamiento: "Calent.",
  aproximacion: "Aprox.",
  objetivo: "Objetivo",
  backoff: "Backoff",
  dropset: "Dropset",
};

const KIND_TONE: Record<SetLog["kind"], string> = {
  calentamiento: "text-slate-400",
  aproximacion: "text-cyan-300",
  objetivo: "text-hunter-cyan",
  backoff: "text-amber-300",
  dropset: "text-violet-300",
};

function Stepper({
  value,
  onChange,
  step,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  step: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(Math.max(0, round05(value - step)))}
        className="flex h-9 w-8 items-center justify-center rounded-lg bg-bg-elev text-xl font-bold text-slate-300 active:scale-95"
      >
        −
      </button>
      <div className="min-w-[2.75rem] text-center leading-none">
        <span className="text-base font-bold text-white">{value}</span>
        {suffix && <span className="text-[10px] text-slate-400">{suffix}</span>}
      </div>
      <button
        onClick={() => onChange(round05(value + step))}
        className="flex h-9 w-8 items-center justify-center rounded-lg bg-bg-elev text-xl font-bold text-slate-300 active:scale-95"
      >
        +
      </button>
    </div>
  );
}

export default function SetLogger({
  set,
  onChange,
}: {
  set: SetLog;
  onChange: (partial: Partial<SetLog>) => void;
}) {
  const completed = set.completed;
  return (
    <div
      className={`rounded-xl border p-2.5 transition ${
        completed
          ? "border-green-500/40 bg-green-500/[0.07]"
          : set.painFlag
          ? "border-red-500/40 bg-red-500/[0.06]"
          : "border-line bg-bg-elev/50"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className={`text-[11px] font-semibold uppercase tracking-wide ${KIND_TONE[set.kind]}`}>
          S{set.setNumber} · {KIND_LABEL[set.kind]}
        </span>
        <span className="text-[11px] text-slate-400">
          obj {set.targetWeight}kg × {repsLabel(set.targetReps, set.targetRepsMax)} · RIR {set.targetRir}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
        <div className="text-center">
          <p className="mb-1 text-[9px] uppercase tracking-wide text-slate-500">Peso</p>
          <Stepper value={set.actualWeight} step={2.5} suffix="kg" onChange={(v) => onChange({ actualWeight: v })} />
        </div>
        <div className="text-center">
          <p className="mb-1 text-[9px] uppercase tracking-wide text-slate-500">Reps</p>
          <Stepper value={set.actualReps} step={1} onChange={(v) => onChange({ actualReps: v })} />
        </div>
        <div className="text-center">
          <p className="mb-1 text-[9px] uppercase tracking-wide text-slate-500">RIR</p>
          <div className="relative">
            <select
              value={set.actualRir}
              onChange={(e) => onChange({ actualRir: Number(e.target.value) })}
              className="h-9 w-14 appearance-none rounded-lg border border-line bg-bg-soft text-center text-base font-bold text-white"
            >
              {[0, 1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <button
          onClick={() => onChange({ completed: !completed, failed: false })}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition active:scale-[0.97] ${
            completed
              ? "bg-green-500/20 text-green-300"
              : "bg-gradient-to-r from-hunter-blue to-hunter-cyan text-white"
          }`}
        >
          {completed ? "✓ Hecha" : "Completar"}
        </button>
        <button
          onClick={() => onChange({ completed: true, failed: true, actualRir: 0 })}
          className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition active:scale-95 ${
            set.failed ? "bg-red-500/25 text-red-300" : "bg-bg-elev text-slate-400"
          }`}
          title="Fallé"
        >
          Fallé
        </button>
        <button
          onClick={() => onChange({ completed: true, tooEasy: !set.tooEasy, actualRir: Math.max(3, set.actualRir) })}
          className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition active:scale-95 ${
            set.tooEasy ? "bg-cyan-500/25 text-cyan-300" : "bg-bg-elev text-slate-400"
          }`}
          title="Muy fácil"
        >
          Fácil
        </button>
        <button
          onClick={() => onChange({ painFlag: !set.painFlag })}
          className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition active:scale-95 ${
            set.painFlag ? "bg-red-500/25 text-red-300" : "bg-bg-elev text-slate-400"
          }`}
          title="Dolor / molestia"
        >
          ⚠
        </button>
      </div>
    </div>
  );
}
