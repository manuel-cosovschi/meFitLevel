"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { exerciseById, EXERCISES } from "@/lib/data/exercises";
import { sessionWorkingWeight } from "@/lib/progression";
import { weekStart, formatDate, muscleLabel } from "@/lib/utils";
import type { MuscleGroup, WorkoutLog } from "@/lib/types";
import { Card, PageHeader, ProgressBar, EmptyState } from "@/components/ui";
import XPBar from "@/components/XPBar";

function BarChart({ data, color = "#3b82f6" }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end justify-between gap-1.5" style={{ height: 110 }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[9px] text-slate-400">{d.value > 0 ? Math.round(d.value) : ""}</span>
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${(d.value / max) * 80}px`,
              background: `linear-gradient(180deg, ${color}, ${color}55)`,
              minHeight: d.value > 0 ? 4 : 0,
            }}
          />
          <span className="text-[9px] text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) return <p className="text-xs text-slate-500">Necesitás al menos 2 sesiones.</p>;
  const w = 300;
  const h = 80;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - ((p - min) / span) * (h - 10) - 5]);
  const d = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#spark)" />
      <path d={d} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {coords.map((c, i) => (
        <circle key={i} cx={c[0]} cy={c[1]} r="3" fill="#22d3ee" />
      ))}
    </svg>
  );
}

export default function ProgressPage() {
  const state = useStore();
  const logs = state.workoutLogs;

  // Volumen semanal (últimas 8 semanas).
  const weeklyVolume = useMemo(() => {
    const map = new Map<string, number>();
    logs.forEach((l) => {
      const w = weekStart(new Date(l.date));
      map.set(w, (map.get(w) ?? 0) + l.totalVolume);
    });
    const weeks: { label: string; value: number }[] = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const ws = weekStart(d);
      weeks.push({ label: ws.slice(8, 10) + "/" + ws.slice(5, 7), value: map.get(ws) ?? 0 });
    }
    return weeks;
  }, [logs]);

  // Frecuencia semanal (entrenamientos por semana).
  const weeklyFreq = useMemo(() => {
    const map = new Map<string, number>();
    logs.forEach((l) => {
      const w = weekStart(new Date(l.date));
      map.set(w, (map.get(w) ?? 0) + 1);
    });
    const weeks: { label: string; value: number }[] = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const ws = weekStart(d);
      weeks.push({ label: ws.slice(8, 10) + "/" + ws.slice(5, 7), value: map.get(ws) ?? 0 });
    }
    return weeks;
  }, [logs]);

  // Series efectivas por grupo muscular (todas las sesiones).
  const setsByMuscle = useMemo(() => {
    const map = new Map<MuscleGroup, number>();
    logs.forEach((l) =>
      l.exercisesLogged.forEach((el) => {
        const id = el.swapped && el.swappedFor ? el.swappedFor : el.exerciseId;
        const ex = exerciseById(id);
        if (!ex) return;
        const eff = el.sets.filter((s) => s.completed && s.kind !== "calentamiento").length;
        map.set(ex.primaryMuscle, (map.get(ex.primaryMuscle) ?? 0) + eff);
      }),
    );
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [logs]);

  // Ejercicios con historial (para selector).
  const exercisesWithHistory = useMemo(() => {
    const ids = new Set<string>();
    logs.forEach((l) =>
      l.exercisesLogged.forEach((el) => ids.add(el.swapped && el.swappedFor ? el.swappedFor : el.exerciseId)),
    );
    return EXERCISES.filter((e) => ids.has(e.id));
  }, [logs]);

  const [selected, setSelected] = useState<string>("");
  const selectedId = selected || exercisesWithHistory[0]?.id || "";

  const exerciseProgress = useMemo(() => {
    const points: { date: string; weight: number }[] = [];
    [...logs]
      .sort((a, b) => +new Date(a.date) - +new Date(b.date))
      .forEach((l) => {
        const el = l.exercisesLogged.find(
          (e) => (e.swapped && e.swappedFor ? e.swappedFor : e.exerciseId) === selectedId,
        );
        if (el) {
          const w = sessionWorkingWeight(el);
          if (w > 0) points.push({ date: l.date, weight: w });
        }
      });
    return points;
  }, [logs, selectedId]);

  const bodyweight = useMemo(
    () =>
      [...state.measurements]
        .filter((m) => m.weight)
        .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    [state.measurements],
  );

  if (logs.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader title="Progreso" />
        <Card>
          <XPBar xp={state.rpg.xp} />
        </Card>
        <EmptyState icon="📈" text="Registrá entrenamientos para ver tus gráficos de volumen, frecuencia y progresión." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Progreso" subtitle="Tu evolución, semana a semana" />

      <Card glow>
        <XPBar xp={state.rpg.xp} />
      </Card>

      <Card>
        <p className="mb-3 text-sm font-bold text-white">Volumen semanal (kg)</p>
        <BarChart data={weeklyVolume} color="#3b82f6" />
      </Card>

      <Card>
        <p className="mb-3 text-sm font-bold text-white">Frecuencia semanal (entrenos)</p>
        <BarChart data={weeklyFreq} color="#8b5cf6" />
      </Card>

      <Card>
        <p className="mb-2 text-sm font-bold text-white">Progresión por ejercicio</p>
        <select
          value={selectedId}
          onChange={(e) => setSelected(e.target.value)}
          className="mb-3 w-full rounded-xl border border-line bg-bg-elev px-3 py-2.5 text-sm text-white"
        >
          {exercisesWithHistory.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
        <Sparkline points={exerciseProgress.map((p) => p.weight)} />
        {exerciseProgress.length >= 2 && (
          <p className="mt-2 text-center text-xs text-slate-400">
            {exerciseProgress[0].weight}kg → {exerciseProgress[exerciseProgress.length - 1].weight}kg ·{" "}
            {formatDate(exerciseProgress[0].date)} a {formatDate(exerciseProgress[exerciseProgress.length - 1].date)}
          </p>
        )}
      </Card>

      <Card>
        <p className="mb-3 text-sm font-bold text-white">Series efectivas por grupo muscular</p>
        <div className="space-y-2">
          {setsByMuscle.map(([m, count]) => (
            <div key={m}>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">{muscleLabel(m)}</span>
                <span className="font-semibold text-hunter-cyan">{count}</span>
              </div>
              <ProgressBar value={count} max={setsByMuscle[0][1]} color="cyan" />
            </div>
          ))}
        </div>
      </Card>

      {bodyweight.length >= 2 && (
        <Card>
          <p className="mb-3 text-sm font-bold text-white">Peso corporal (kg)</p>
          <Sparkline points={bodyweight.map((m) => m.weight!)} />
        </Card>
      )}
    </div>
  );
}
