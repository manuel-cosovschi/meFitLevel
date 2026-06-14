"use client";

import Link from "next/link";
import type { SaveWorkoutResult } from "@/lib/store";
import { exerciseById } from "@/lib/data/exercises";
import { Card, Pill } from "@/components/ui";
import ProgressionBadge from "@/components/ProgressionBadge";
import { muscleLabel } from "@/lib/utils";

export default function WorkoutSummary({ result }: { result: SaveWorkoutResult }) {
  const wl = result.workout;
  return (
    <div className="animate-slide-up space-y-4">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-hunter-cyan">Sesión completada</p>
        <h1 className="text-2xl font-bold text-white">{wl.templateName}</h1>
      </div>

      <Card glow>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-2xl font-black text-gradient">+{result.xpEarned}</p>
            <p className="text-[10px] uppercase text-slate-400">XP ganada</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">{wl.totalVolume.toLocaleString("es-AR")}</p>
            <p className="text-[10px] uppercase text-slate-400">Volumen kg</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">{wl.effectiveSets}</p>
            <p className="text-[10px] uppercase text-slate-400">Series efect.</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">Duración: {wl.duration} min</p>
      </Card>

      {result.leveledUp && (
        <Card glow>
          <p className="text-center text-sm font-semibold text-violet-300">
            ⬆ ¡Subiste a nivel {result.toLevel}!
          </p>
        </Card>
      )}

      {wl.prs.length > 0 && (
        <Card>
          <p className="mb-2 text-sm font-bold text-amber-300">🏆 PRs</p>
          {wl.prs.map((p, i) => (
            <p key={i} className="text-sm text-slate-200">
              {p}
            </p>
          ))}
        </Card>
      )}

      <Card>
        <p className="mb-2 text-sm font-bold text-white">Músculos trabajados</p>
        <div className="flex flex-wrap gap-1.5">
          {wl.muscleGroups.map((m) => (
            <Pill key={m} tone="blue">
              {muscleLabel(m)}
            </Pill>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-sm font-bold text-white">Progresión para la próxima vez</p>
        <div className="space-y-2">
          {result.suggestions.map((s) => {
            const name = exerciseById(s.exerciseId)?.name ?? s.exerciseId;
            return (
              <div key={s.exerciseId} className="rounded-lg bg-bg-elev px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-200">{name}</span>
                  <ProgressionBadge suggestion={s} />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">{s.message}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {wl.symptoms.length > 0 && (
        <Card>
          <p className="text-sm font-semibold text-red-300">
            ⚠ Registraste síntomas. Priorizá recuperación y consultá si persisten.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/"
          className="rounded-xl bg-bg-elev py-3 text-center font-semibold text-white active:scale-[0.98]"
        >
          Ir al inicio
        </Link>
        <Link
          href="/workout/history"
          className="rounded-xl bg-gradient-to-r from-hunter-blue to-hunter-violet py-3 text-center font-semibold text-white active:scale-[0.98]"
        >
          Ver historial
        </Link>
      </div>
    </div>
  );
}
