"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { getTemplate } from "@/lib/selectors";
import { exerciseById } from "@/lib/data/exercises";
import { Card, PageHeader, Pill } from "@/components/ui";

export default function RoutinesPage() {
  const state = useStore();
  const setWeekDays = useStore((s) => s.setWeekDays);
  const setTodayIndex = useStore((s) => s.setTodayIndex);
  const duplicateTemplate = useStore((s) => s.duplicateTemplate);

  const plan = state.weekPlan;

  return (
    <div className="space-y-4">
      <PageHeader title="Rutinas" subtitle="Plan semanal y plantillas" />

      {/* Selector de días disponibles */}
      <Card glow>
        <p className="mb-2 text-sm font-bold text-white">¿Cuántos días entrenás esta semana?</p>
        <p className="mb-3 text-xs text-slate-400">
          La app reorganiza el plan priorizando piernas/glúteos, torso completo, hombros/brazos y core.
        </p>
        <div className="flex gap-2">
          {[2, 3, 4, 5].map((d) => (
            <button
              key={d}
              onClick={() => setWeekDays(d)}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition active:scale-[0.97] ${
                plan.daysAvailable === d
                  ? "border-hunter-blue bg-hunter-blue/15 text-hunter-cyan shadow-glow-soft"
                  : "border-line bg-bg-elev text-slate-300"
              }`}
            >
              {d} días
            </button>
          ))}
        </div>
      </Card>

      {/* Plan de la semana */}
      <Card>
        <p className="mb-3 text-sm font-bold text-white">Plan de esta semana</p>
        <div className="space-y-2">
          {plan.templateIds.map((tid, i) => {
            const t = getTemplate(state, tid);
            if (!t) return null;
            const isToday = i === state.todayIndex;
            return (
              <div
                key={tid + i}
                className={`rounded-xl border p-3 ${
                  isToday ? "border-hunter-blue/50 bg-hunter-blue/10" : "border-line bg-bg-elev/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      Día {i + 1} · {t.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{t.description}</p>
                  </div>
                  {isToday ? (
                    <Pill tone="blue">HOY</Pill>
                  ) : (
                    <button
                      onClick={() => setTodayIndex(i)}
                      className="rounded-lg bg-bg-elev px-2.5 py-1 text-[11px] font-semibold text-slate-300"
                    >
                      Marcar hoy
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <Link
          href="/workout/today"
          className="mt-3 block w-full rounded-xl bg-gradient-to-r from-hunter-blue to-hunter-violet py-3 text-center font-bold text-white active:scale-[0.98]"
        >
          Empezar día actual
        </Link>
      </Card>

      {/* Todas las plantillas */}
      <Card>
        <p className="mb-3 text-sm font-bold text-white">Plantillas disponibles</p>
        <div className="space-y-3">
          {state.templates.map((t) => (
            <div key={t.id} className="rounded-xl border border-line bg-bg-elev/40 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-[11px] text-slate-400">{t.description}</p>
                </div>
                <button
                  onClick={() => duplicateTemplate(t.id)}
                  className="rounded-lg bg-bg-elev px-2.5 py-1 text-[11px] font-semibold text-hunter-cyan"
                >
                  Duplicar
                </button>
              </div>
              <div className="mt-2 space-y-0.5">
                {t.exercises.map((we) => (
                  <p key={we.exerciseId} className="text-xs text-slate-400">
                    • {exerciseById(we.exerciseId)?.name} · {we.sets.length}×{we.targetReps} · {we.suggestedWeight}kg
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-500">
          Las plantillas y ejercicios base se editan en <code>lib/data/</code>. La duplicación crea
          copias editables (próximamente edición completa desde la UI).
        </p>
      </Card>
    </div>
  );
}
